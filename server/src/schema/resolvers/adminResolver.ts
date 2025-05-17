/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */

import bcrypt from 'bcrypt';
import { Op, Transaction } from 'sequelize';
import {models} from '../../db_loaders/mongodb';
import {db, sequelize} from '../../db_loaders/mysql';
import {checkAuthentication} from '../../lib/ultis/permision';
import {IResolvers, ISuccessResponse} from '../../__generated__/graphql';
import {
    AuthenticationError,
    UserNotFoundError
} from '../../lib/classes/graphqlErrors';
import { DefaultHashValue, roleID, status_job } from '../../lib/enum';
import {
    formatCandidate,
    formatEmployer,
    iRoleToNumber,
    mapJobToGraphQL,
    Status_Job_ToNumber,
    streamToBuffer,
    type_job_ToNumber,
} from '../../lib/enum_resolvers';
import {skillsAttributes} from '../../db_models/sql/skills';
import {industriesAttributes} from '../../db_models/sql/industries';
import { Ibranchs, IEmployer, Iheadquarters } from '../../db_models/no_sql/employer';
import {app} from '../../config/appConfig';


const adminResolver: IResolvers = {
    Query: {
        listUsers: async (_parent, { input }, context) => {
            try {
                checkAuthentication(context);
                const { user } = context;
                if (user.role !== roleID.ADMIN) throw new AuthenticationError('Không phải admin');

                const { role, limit, page } = input;
                const startIndex = (page - 1) * limit;

                const totalUsers = await db.users.count({ where: { role } });

                const users = await db.users.findAll({
                    where: { role },
                    offset: startIndex,
                    limit,
                });

                const usersIds = users.map(u => u.user_id);

                let profiles: any[] = [];
                if (role === roleID.EMPLOYER) {
                    profiles = await models.employer.find({ user_id: { $in: usersIds } }).lean();
                } else if (role === roleID.CANDIDATE) {
                    profiles = await models.candidate.find({ user_id: { $in: usersIds } }).lean();
                }

                const profileMap = profiles.reduce((acc, p) => {
                    acc[p.user_id] = p;
                    return acc;
                }, {});

                const information = await Promise.all(
                    users.map(async (u) => {
                        const u_avatar = u.toJSON() as any;
                        const check_avatar = await models.avatar.findOne({ user_id :u.user_id}).lean();
                        u_avatar.avatar = check_avatar ? `http://${app.host}:${app.port}/avatar/${u.user_id}` : null;
                        if (role === roleID.EMPLOYER) {
                            const empProfile = profileMap[u.user_id];
                            const formattedEmployer = empProfile ? await formatEmployer(empProfile, { requesterRole: roleID.ADMIN }) : null;
                            return {
                                user: u_avatar,
                                employerProfile: formattedEmployer,
                                candidateProfile: null,
                            };
                        }
                        if (role === roleID.CANDIDATE) {
                            const candProfile = profileMap[u.user_id];
                            const formattedCandidate = candProfile ? await formatCandidate(candProfile, { requesterRole: roleID.ADMIN }) : null;
                            return {
                                user: u_avatar,
                                employerProfile: null,
                                candidateProfile: formattedCandidate,
                            };
                        }
                            return {
                                user: u_avatar,
                                employerProfile: null,
                                candidateProfile: null,
                            };

                    })
                );

                return {
                    information,
                    pagination: {
                        total: totalUsers,
                        page,
                        limit,
                        totalPages: Math.ceil(totalUsers / limit),
                    },
                };
            } catch (error) {
                throw new Error(`Failed to fetch users: ${error}`);
            }
        },
        findUserByEmail : async (_parent, {email}, context) => {
            interface IFilteredCandidate {
                user_id: number;
                candidate_id: number;
                skills: skillsAttributes[];
                total_experience_years?: number;
                status?: boolean;
                cv_url?: string;
                job_selection_criteria?: any,
                experience?: any;
                updated_at?: Date;
            }
            interface IEmployer {
                employer_id: number;
                user_id: number;
                name_employer: string;
                description?: string;
                industry: industriesAttributes[];
                social_links?: {
                    website?: string;
                    facebook?: string;
                    linkedin?: string;
                };
                branches?: Ibranchs[];
                interest?: {
                    salary?: string;
                    insurance?: string;
                    award?: string;
                };
                number_of_employees?: number;
                city_address?: Iheadquarters;
                status?: boolean;
                updated_at?: Date;
            }
            checkAuthentication(context);
            const {user} = context;
            if(user.role !== roleID.ADMIN) throw new AuthenticationError('ban khong the thuc hien chuc nang nay');
            const check_user = await db.users.findOne({
                where:{
                    email
                }
            });
            if (!check_user) throw new UserNotFoundError('khong tim thay nguoi nay');

            const candidate = await models.candidate.findOne({user_id : check_user.user_id}).lean();
            const employer = await models.employer.findOne({user_id : check_user.user_id}).lean();

            let filteredCandidate: IFilteredCandidate | null = null;
            if (candidate) {
                filteredCandidate = await formatCandidate(candidate, {
                    requesterRole : user.role,
                });
            }
            let filteredEmployer: IEmployer | null = null;
            if (employer) {
                filteredEmployer = await formatEmployer(employer, {
                    requesterRole : user.role
                });
            }
            const users = check_user.toJSON() as any;
            const check_avatar = await models.avatar.findOne({user_id : check_user.user_id}).lean();
            users.avatar = check_avatar ? `http://${app.host}:${app.port}/avatar/${check_user.user_id}` : null;
            return {
                user : users,
                candidateProfile: filteredCandidate,
                employerProfile: filteredEmployer,
            };
        },
        pendingJobs: async (_parent, {input}, context) => {
            checkAuthentication(context);
            const {
                limit,
                page,
            } = input;
            const {user} = context;
            if(user.role !== roleID.ADMIN) throw new AuthenticationError('');
            try {
                const totalJobs = await models.job.countDocuments({
                    employer_id: user.id,
                    status : status_job.pending
                });
                const startIndex = (page - 1) * limit;
                const jobs = await models.job.find({
                    status : status_job.pending
                })
                    .skip(startIndex)
                    .limit(limit)
                    .lean();
                const skillIds = jobs.flatMap(job => job.skills_required || []);
                const categoryIds = jobs.flatMap(job => job.job_categories || []);
                const [skills, jobCategories] = await Promise.all([
                    db.skills.findAll({
                        where: {skill_id: {[Op.in]: skillIds.length ? skillIds : [0]}},
                        attributes: ['skill_id', 'name'],
                        raw: true,
                    }),
                    db.job_categories.findAll({
                        where: {category_id: {[Op.in]: categoryIds.length ? categoryIds : [0]}},
                        attributes: ['category_id', 'name'],
                        raw: true,
                    })
                ]);
                return {
                    jobs: jobs.map(job => mapJobToGraphQL(job, skills, jobCategories)),
                    pagination: {
                        total: totalJobs,
                        page,
                        limit,
                        totalPages: Math.ceil(totalJobs / limit)
                    }
                };
            } catch (error) {
                throw new Error(`Failed to fetch featured jobs: ${error}`);
            }
        },
        pendingEmployers : async (_parent, {input}, context) => {
            try {
                checkAuthentication(context);
                const {user} = context;
                const {
                    limit,
                    page
                } = input;
                if(user.role !== roleID.ADMIN) throw new AuthenticationError('');
                const totalEmployers = await models.employer.countDocuments({status : false });
                const totalPages = Math.ceil(totalEmployers / limit);
                const startIndex = (page - 1) * limit;
                const check_employer : IEmployer[] = await models.employer.find({status : false})
                    .skip(startIndex)
                    .limit(limit)
                    .lean();
                const userIds = check_employer.map(e => e.user_id);
                const users = await db.users.findAll({
                    where: { user_id: userIds }
                });
                const userMap = new Map(users.map(user => [user.user_id, user]));
                const formattedEmployers = await Promise.all(
                    check_employer
                        .filter(e => userMap.has(e.user_id))
                        .map(async (employer) => {
                            const formatted = await formatEmployer(employer, { requesterRole: context.user.role });
                            return {
                                user: userMap.get(employer.user_id)!,
                                employer: formatted
                            };
                        })
                );
                return {
                    employer: formattedEmployers,
                    pagination: {
                        total: totalEmployers,
                        page,
                        limit,
                        totalPages
                    }
                };

            } catch (error) {
                throw new Error(`Failed to fetch featured employers: ${error}`);
            }
        },
        getMasterData: async (_parent, {type}, context) => {
            try {
                checkAuthentication(context);
                const {user} = context;
                if(user.role !== roleID.ADMIN) throw new AuthenticationError('');
                switch (type) {
                    case 'INDUSTRY': {
                        const industry = await db.industries.findAll();
                        return { industry, job_category: null, skill: null };
                    }
                    case 'JOB_CATEGORY': {
                        const job_category = await db.job_categories.findAll();
                        return { industry: null, job_category, skill: null };
                    }
                    case 'SKILL': {
                        const skill = await db.skills.findAll();
                        return { industry: null, job_category: null, skill };
                    }
                    default:
                        return { industry: null, job_category: null, skill: null };
                }
            } catch (error) {
                throw new Error(`Failed to fetch users: ${error}`);
            }
        },
    },
    Mutation: {
        deleteUser: async (_parent, { user_id }, context) => {
                checkAuthentication(context);
                const { user } = context;
                if (user.role !== roleID.ADMIN) throw new AuthenticationError('Không phải admin');
                const check_user = await db.users.findByPk(user_id);
                if(!check_user) throw new Error('nguowif dung khong ton tai');
            await db.users.update(
                {status : false},
                { where: { user_id }}
            );
            return ISuccessResponse.Success;
        },
        updateJobStatus: async (_parent, { jobId, status}, context) => {
            checkAuthentication(context);
            const { user } = context;
            if (user.role !== roleID.ADMIN) throw new AuthenticationError('Không phải admin');
            const check_job = await models.job.findOne({job_id : jobId});
            if(!check_job) throw new Error('job khong ton tai');
            check_job.status = Status_Job_ToNumber(status);
            await check_job.save();
             return ISuccessResponse.Success;
        },
        updateEmployerStatus: async (_parent, { employerId, status}, context) => {
            checkAuthentication(context);
            const { user } = context;
            if (user.role !== roleID.ADMIN) throw new AuthenticationError('Không phải admin');
            const check_employer = await models.employer.findOne({employer_id : employerId});
            if(!check_employer) throw new Error('employer khong ton tai');
            check_employer.status = status;
            await check_employer.save();
            return ISuccessResponse.Success;
        },
        createMasterData: async (_parent, {input}, context) => {
            checkAuthentication(context);
            const { user } = context;
            if (user.role !== roleID.ADMIN) throw new AuthenticationError('Không phải admin');
            const {
                type,
                name,
            } = input;
            switch (type) {
                case 'INDUSTRY': {
                    await db.industries.create({name});
                    return ISuccessResponse.Success;
                }
                case 'JOB_CATEGORY': {
                    await db.job_categories.create({name});
                    return ISuccessResponse.Success;
                }
                case 'SKILL': {
                    await db.skills.create({name});
                    return ISuccessResponse.Success;
                }
                default:
                    throw new Error('nhap dung type');
            }
        },
        updateMasterData: async (_parent, {id , input}, context) => {
            checkAuthentication(context);
            const { user } = context;
            if (user.role !== roleID.ADMIN) throw new AuthenticationError('Không phải admin');
            const {
                type,
                name,
            } = input;
            switch (type) {
                case 'INDUSTRY': {
                    const [affectedRows] = await db.industries.update(
                        { name },
                        {
                            where: { industry_id: id },
                        }
                    );
                    if (affectedRows === 0) {
                        throw new Error('Industry khong hop le');
                    }
                    return ISuccessResponse.Success;
                }
                case 'JOB_CATEGORY': {
                    const [affectedRows] = await db.job_categories.update(
                        { name },
                        {
                            where: { category_id: id },
                        }
                    );
                    if (affectedRows === 0) {
                        throw new Error('category_id khong hop le');
                    }
                    return ISuccessResponse.Success;
                }
                case 'SKILL': {
                    const [affectedRows] = await db.skills.update(
                        { name },
                        {
                            where: { skill_id: id },
                        }
                    );
                    if (affectedRows === 0) {
                        throw new Error('skill_id khong hop le');
                    }
                    return ISuccessResponse.Success;
                }
                default:
                    throw new Error('nhap dung type');
            }
        },
    },
};
export default adminResolver;
