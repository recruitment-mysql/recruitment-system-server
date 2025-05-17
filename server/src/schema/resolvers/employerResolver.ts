/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */

import { Op, QueryTypes } from 'sequelize';
import { Readable } from 'stream';
import { models } from '../../db_loaders/mongodb';
import { db, sequelize } from '../../db_loaders/mysql';
import {
    IResolvers,
    ISkill,
    ISuccessResponse,
} from '../../__generated__/graphql';
import {
    AuthenticationError,
    InValidRoleError,
    MySQLError,
    TaskNotAllowUpdateError,
    UserNotFoundError,
} from '../../lib/classes/graphqlErrors';
import { roleID, status_job, type_job } from '../../lib/enum';
import { checkAuthentication } from '../../lib/ultis/permision';
import { job_categoriesAttributes } from '../../db_models/sql/job_categories';
import { Ibranchs } from '../../db_models/no_sql/job';
import {
    formatCandidate,
    formatEmployer,
    mapJobToGraphQL,
    Status_Application_ToNumber,
    type_degree_ToNumber,
    type_job_ToNumber,
} from '../../lib/enum_resolvers';
import { app } from '../../config/appConfig';
import { skillsAttributes } from '../../db_models/sql/skills';
import { industriesAttributes } from '../../db_models/sql/industries';
import { Iheadquarters } from '../../db_models/no_sql/employer';

const employerResolver: IResolvers = {
    Query: {
        meEmployer: async (_parent, _, context) => {
            try {
                checkAuthentication(context);
                const { user } = context;
                const employer = await models.employer
                    .findOne({ user_id: user.id })
                    .lean();
                if (!employer) throw new UserNotFoundError();
                const formatedEmployer = await formatEmployer(employer, {
                    isSelf: true,
                });
                return formatedEmployer;
            } catch (error) {
                throw new Error(`Failed to fetch applied jobs: ${error}`);
            }
        },
        listJobByEmployer: async (_parent, { input }, context) => {
            checkAuthentication(context);
            const { limit, page, status } = input;
            const { user } = context;
            if (user.role !== roleID.EMPLOYER)
                throw new AuthenticationError('');
            try {
                const totalJobs = await models.job.countDocuments({
                    employer_id: user.id,
                    status,
                });
                const startIndex = (page - 1) * limit;
                const jobs = await models.job
                    .find({
                        employer_id: user.id,
                        status,
                    })
                    .skip(startIndex)
                    .limit(limit)
                    .lean();
                const skillIds = jobs.flatMap(
                    (job) => job.skills_required || []
                );
                const categoryIds = jobs.flatMap(
                    (job) => job.job_categories || []
                );
                const [skills, jobCategories] = await Promise.all([
                    db.skills.findAll({
                        where: {
                            skill_id: {
                                [Op.in]: skillIds.length ? skillIds : [0],
                            },
                        },
                        attributes: ['skill_id', 'name'],
                        raw: true,
                    }),
                    db.job_categories.findAll({
                        where: {
                            category_id: {
                                [Op.in]: categoryIds.length ? categoryIds : [0],
                            },
                        },
                        attributes: ['category_id', 'name'],
                        raw: true,
                    }),
                ]);
                return {
                    jobs: jobs.map((job) =>
                        mapJobToGraphQL(job, skills, jobCategories)
                    ),
                    pagination: {
                        total: totalJobs,
                        page,
                        limit,
                        totalPages: Math.ceil(totalJobs / limit),
                    },
                };
            } catch (error) {
                throw new Error(`Failed to fetch featured jobs: ${error}`);
            }
        },
        listApplicantsByJob: async (_parent, { jobId }, context) => {
            try {
                checkAuthentication(context);

                const isRequesterEmployer =
                    context.user.role === roleID.EMPLOYER;
                if (!isRequesterEmployer) {
                    throw new AuthenticationError('Không phải employer');
                }

                const job = await models.job
                    .findOne({ job_id: jobId, employer_id: context.user.id })
                    .lean();
                if (!job) {
                    throw new MySQLError(
                        'Không tìm thấy công việc hoặc công việc không thuộc quyền sở hữu của bạn'
                    );
                }

                const applications = await db.applications.findAll({
                    where: { job_id: jobId },
                    attributes: ['candidate_id', 'status', 'applied_at'],
                });

                if (applications.length === 0) {
                    return [];
                }

                const candidateIds = applications.map(
                    (app) => app.candidate_id
                );

                const [users, candidates, avatars] = await Promise.all([
                    db.users.findAll({ where: { user_id: candidateIds } }),
                    models.candidate
                        .find({ user_id: { $in: candidateIds } })
                        .lean(),
                    models.avatar
                        .find({ user_id: { $in: candidateIds } })
                        .lean(),
                ]);
                const formattedCandidates = await Promise.all(
                    candidates.map((candidate) =>
                        formatCandidate(candidate, {
                            isRequesterEmployer: true,
                        })
                    )
                );
                const avatarMap = new Map(
                    avatars.map((avatar) => [avatar.user_id, avatar])
                );
                const merged = applications.map((application) => {
                    const user = users.find(
                        (u) => u.user_id === application.candidate_id
                    );
                    if (!user) {
                        console.warn(
                            `Không tìm thấy user với id: ${application.candidate_id}`
                        );
                        return null;
                    }

                    const userObj = user?.toJSON() as any;
                    const hasAvatar = avatarMap.has(application.candidate_id);
                    userObj.avatar = hasAvatar
                        ? `http://${app.host}:${app.port}/avatar/${application.candidate_id}`
                        : null;

                    const candidate = formattedCandidates.find(
                        (c) => c?.user_id === application.candidate_id
                    );

                    return {
                        user: userObj,
                        candidateProfile: candidate,
                        status: application.status,
                        applied_at: application.applied_at,
                    };
                });

                return merged;
            } catch (error) {
                console.error(error);
                throw new Error(
                    `Failed to list applicants by job: ${error || error}`
                );
            }
        },
        listAllApplicantsByJob: async (_parent, _, context) => {
            try {
                checkAuthentication(context);

                const isRequesterEmployer =
                    context.user.role === roleID.EMPLOYER;
                if (!isRequesterEmployer)
                    throw new AuthenticationError('không phải employer');
                const job_for_employer = await models.job
                    .find({ employer_id: context.user.id }, { job_id: 1 })
                    .lean();
                if (!job_for_employer) {
                    return [];
                }
                const applications = await db.applications.findAll({
                    where: {
                        job_id: {
                            [Op.in]: job_for_employer.map((j) => j.job_id),
                        },
                    },
                    attributes: ['candidate_id', 'status', 'applied_at'],
                });
                const candidateIds = applications.map(
                    (app) => app.candidate_id
                );

                const [users, candidates, avatars] = await Promise.all([
                    db.users.findAll({ where: { user_id: candidateIds } }),
                    models.candidate
                        .find({ candidate_id: { $in: candidateIds } })
                        .lean(),
                    models.avatar
                        .find({ user_id: { $in: candidateIds } })
                        .lean(),
                ]);
                const formattedCandidates = await Promise.all(
                    candidates.map((candidate) =>
                        formatCandidate(candidate, {
                            isRequesterEmployer: true,
                        })
                    )
                );
                const avatarMap = new Map(
                    avatars.map((avatar) => [avatar.user_id, avatar])
                );
                const merged = applications
                    .map((application) => {
                        const user = users.find(
                            (u) => u.user_id === application.candidate_id
                        );
                        const candidate = formattedCandidates.find(
                            (c) => c?.user_id === application.candidate_id
                        );
                        if (!user || !candidate) return null;

                        const userObj = user?.toJSON() as any;
                        const hasAvatar = avatarMap.has(
                            application.candidate_id
                        );
                        userObj.avatar = hasAvatar
                            ? `http://${app.host}:${app.port}/avatar/${application.candidate_id}`
                            : null;

                        return {
                            user: userObj,
                            candidateProfile: candidate,
                            status: application.status,
                            applied_at: application.applied_at,
                        };
                    })
                    .filter(Boolean);
                return merged;

                return merged;
            } catch (error) {
                throw new Error(`Failed to list applicants by job: ${error}`);
            }
        },
        findCandidateByEmail: async (_parent, { email }, context) => {
            interface IFilteredCandidate {
                user_id: number;
                candidate_id: number;
                skills: skillsAttributes[];
                total_experience_years?: number;
                status?: boolean;
                cv_url?: string;
                job_selection_criteria?: any;
                experience?: any;
                updated_at?: Date;
            }
            checkAuthentication(context);
            const { user } = context;
            if (user.role === roleID.CANDIDATE)
                throw new AuthenticationError(
                    'ban khong the thuc hien chuc nang nay'
                );
            const jobs = await models.job.find(
                { employer_id: user.id },
                { job_id: 1 }
            );

            const jobIds = jobs.map((job) => job.job_id);
            const applications = await db.applications.findAll({
                where: { job_id: jobIds },
                attributes: ['candidate_id'],
                raw: true,
            });
            const candidateIds = applications.map((app) => app.candidate_id);
            const check_user = await db.users.findOne({
                where: {
                    email,
                },
            });
            let filteredCandidate: IFilteredCandidate | null = null;
            if (check_user && candidateIds.includes(check_user.user_id)) {
                const candidate = await models.candidate.findOne({user_id : check_user.user_id}).lean();
                console.log('candidate',candidate);
                filteredCandidate = await formatCandidate(candidate, {
                    isRequesterEmployer : true,
                });
                console.log('filteredCandidate',filteredCandidate);
                const users = check_user.toJSON() as any;
                const check_avatar = await models.avatar
                    .findOne({ user_id: check_user.user_id })
                    .lean();
                users.avatar = check_avatar
                    ? `http://${app.host}:${app.port}/avatar/${check_user.user_id}`
                    : null;
                return {
                    user: users,
                    candidateProfile: filteredCandidate,
                };
            } throw new Error('khong tim thay ung vien nay da ung tuyen ');

        },
    },
    Mutation: {
        updateEmployerProfile: async (_parent, { input }, context) => {
            try {
                checkAuthentication(context);
                const { user } = context;
                const check_employer = await models.employer
                    .findOne({ employer_id: user.id })
                    .lean();
                if (!check_employer)
                    throw new AuthenticationError(
                        'Không phải employer hoặc employer không tồn tại'
                    );

                const {
                    headquarters,
                    industry_id,
                    description,
                    social_links_Website,
                    social_links_Facebook,
                    social_links_Youtube,
                    number_of_employees,
                } = input;

                const updateData: any = {};

                if (industry_id !== undefined)
                    updateData.industry_id = industry_id;
                if (
                    description !== undefined &&
                    description !== null &&
                    description.trim() !== ''
                )
                    updateData.description = description;
                if (number_of_employees !== undefined)
                    updateData.number_of_employees = number_of_employees;
                if (headquarters !== undefined && headquarters)
                    updateData.city_address = headquarters;

                const currentSocialLinks = check_employer.social_links || {};

                if (
                    social_links_Website !== undefined ||
                    social_links_Facebook !== undefined ||
                    social_links_Youtube !== undefined
                ) {
                    updateData.social_links = {
                        ...currentSocialLinks,
                        website:
                            social_links_Website !== undefined
                                ? social_links_Website
                                : currentSocialLinks.website,
                        facebook:
                            social_links_Facebook !== undefined
                                ? social_links_Facebook
                                : currentSocialLinks.facebook,
                        youtube:
                            social_links_Youtube !== undefined
                                ? social_links_Youtube
                                : currentSocialLinks.youtube,
                    };
                }

                await models.employer.findOneAndUpdate(
                    { employer_id: user.id },
                    { $set: updateData },
                    { upsert: true, new: true }
                );

                return ISuccessResponse.Success;
            } catch (error) {
                throw new Error(
                    `Cập nhật thông tin nhà tuyển dụng thất bại: ${error}`
                );
            }
        },
        createJob: async (_parent, { input }, context) => {
            try {
                checkAuthentication(context);
                const { user } = context;
                const check_employer = await models.employer
                    .findOne({ employer_id: user.id })
                    .lean();
                if (!check_employer)
                    throw new AuthenticationError(
                        'Employer không tồn tại hoặc không phải employer'
                    );
                if (check_employer.status === false)
                    throw new AuthenticationError(
                        'hay xac minh tai khoan doanh nghiep'
                    );

                const {
                    title,
                    description,
                    skills_required,
                    job_categories,
                    degree,
                    experience_years_required,
                    quantity,
                    foreign_language,
                    Salary,
                    job_type,
                    branches,
                } = input;

                const isValidString = (str: string | undefined) =>
                    str && str.trim() !== '';

                // eslint-disable-next-line max-len
                if (
                    !isValidString(title) ||
                    !isValidString(description) ||
                    !skills_required ||
                    !job_categories ||
                    !degree ||
                    !experience_years_required ||
                    !Salary ||
                    !job_type ||
                    !branches
                ) {
                    throw new Error('Vui lòng điền đầy đủ các trường yêu cầu');
                }

                if (!check_employer.branches) {
                    throw new Error('Employer hoặc chi nhánh không tồn tại');
                }
                const selectedBranches = check_employer.branches.filter(
                    (branch: any) => branches.includes(branch.id)
                );
                if (selectedBranches.length === 0)
                    throw new Error('Không tìm thấy chi nhánh hợp lệ');

                const job_id = `job_${new Date().getTime()}_${Math.random().toString(36).substring(2, 10)}_${String(user.id).substring(0, 5)}`;
                const newJob = new models.job({
                    job_id,
                    employer_id: user.id,
                    title,
                    description,
                    skills_required,
                    job_categories,
                    degree,
                    experience_years_required,
                    quantity,
                    foreign_language,
                    Salary,
                    job_type,
                    branches: selectedBranches,
                    status: status_job.pending,
                    created_at: new Date(),
                    updated_at: new Date(),
                });

                await newJob.save();
                return ISuccessResponse.Success;
            } catch (error) {
                throw new Error(`Tạo công việc thất bại: ${error}`);
            }
        },
        updateJob: async (_parent, { input }, context) => {
            try {
                checkAuthentication(context);
                const { user } = context;
                const check_employer = await models.employer
                    .findOne({ employer_id: user.id })
                    .lean();
                if (!check_employer)
                    throw new AuthenticationError('ban không có quyền');
                const {
                    jobId,
                    title,
                    description,
                    skills_required,
                    job_categories,
                    degree,
                    experience_years_required,
                    quantity,
                    foreign_language,
                    Salary,
                    job_type,
                    branches,
                    status,
                } = input;
                const check_job = await models.job.findOne({ job_id: jobId });
                if (!check_job || check_job.employer_id !== user.id) {
                    throw new AuthenticationError(
                        'Không phải người tạo ra công việc này'
                    );
                }

                const isValidString = (str: string | undefined) =>
                    str && str.trim() !== '';
                if (!check_employer.branches) {
                    throw new Error('Employer hoặc chi nhánh không tồn tại');
                }
                if (branches) {
                    const selectedBranches = check_employer.branches.filter(
                        (branch: any) => branches.includes(branch.id)
                    );
                    if (selectedBranches.length === 0)
                        throw new Error('Không tìm thấy chi nhánh hợp lệ');
                    check_job.branches = selectedBranches;
                }
                check_job.title =
                    title && isValidString(title) ? title : check_job.title;
                check_job.description =
                    description && isValidString(description)
                        ? description
                        : check_job.description;
                if (skills_required != null) {
                    check_job.skills_required = skills_required.filter(
                        (n): n is number => n != null
                    );
                }
                if (job_categories != null) {
                    check_job.job_categories = job_categories.filter(
                        (n): n is number => n != null
                    );
                }
                check_job.degree =
                    degree && type_degree_ToNumber(degree)
                        ? degree
                        : check_job.degree;
                check_job.experience_years_required =
                    experience_years_required ??
                    check_job.experience_years_required;
                check_job.quantity = quantity ?? check_job.quantity;
                check_job.foreign_language =
                    foreign_language ?? check_job.foreign_language;
                check_job.Salary = Salary ?? check_job.Salary;
                check_job.job_type = job_type
                    ? type_job_ToNumber(job_type)
                    : check_job.job_type;
                if (status) {
                    if (
                        check_job.status === status_job.approved &&
                        status === status_job.closed
                    ) {
                        check_job.status = status;
                    } else if (
                        check_job.status === status_job.closed &&
                        status === status_job.approved
                    ) {
                        check_job.status = status;
                    } else throw new Error('ban khong co quyen ');
                }
                await check_job.save();
                return ISuccessResponse.Success;
            } catch (error) {
                throw new Error(`Cập nhật công việc thất bại: ${error}`);
            }
        },
        updateApplicantStatus: async (_parent, { input }, context) => {
            try {
                checkAuthentication(context);
                const { user } = context;
                const { jobId, candidateId, status } = input;
                const check_job_for_employer = await models.job
                    .findOne({
                        employer_id: user.id,
                        job_id: jobId,
                    })
                    .lean();
                if (!check_job_for_employer) throw new InValidRoleError();
                const check_aplications = await db.applications.findOne({
                    where: {
                        job_id: jobId,
                        candidate_id: candidateId,
                    },
                });
                if (!check_aplications) {
                    throw new TaskNotAllowUpdateError(
                        'không tìm thấy ứng viên này ứng tuyển việc'
                    );
                }
                check_aplications.status = status
                    ? Status_Application_ToNumber(status)
                    : check_aplications.status;
                check_aplications.save();
                return ISuccessResponse.Success;
            } catch (error) {
                throw new Error(`Cập nhật công việc thất bại: ${error}`);
            }
        },
        deleteJob: async (_parent, { jobId }, context) => {
            try {
                checkAuthentication(context);
                const { user } = context;
                const check_job_for_employer = await models.job
                    .findOne({
                        employer_id: user.id,
                        job_id: jobId,
                    })
                    .lean();
                if (!check_job_for_employer)
                    throw new InValidRoleError(
                        'không có job hoă bạn không tạo ra job này'
                    );
                await models.job.deleteMany({ job_id: jobId });
                await models.follow_job.deleteMany({ job_id: jobId });
                await db.applications.destroy({
                    where: {
                        job_id: jobId,
                    },
                });
                return ISuccessResponse.Success;
            } catch (error) {
                throw new Error(`Cập nhật công việc thất bại: ${error}`);
            }
        },
    },
};
export default employerResolver;
