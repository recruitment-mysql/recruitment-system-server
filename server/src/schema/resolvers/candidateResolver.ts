/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */

import {Op, QueryTypes} from 'sequelize';
import {Readable} from 'stream';
import {models} from '../../db_loaders/mongodb';
import {db, sequelize} from '../../db_loaders/mysql';
import {IResolvers, ISuccessResponse} from '../../__generated__/graphql';
import {AuthenticationError, UserNotFoundError} from '../../lib/classes/graphqlErrors';
import {roleID, status_job , status_application} from '../../lib/enum';
import { formatCandidate, formatEmployer, mapJobToGraphQL, streamToBuffer } from '../../lib/enum_resolvers';
import {checkAuthentication} from '../../lib/ultis/permision';
import {Ibranchs, IJob} from '../../db_models/no_sql/job';
import {IEmployer} from '../../db_models/no_sql/employer';
import {app} from '../../config/appConfig';
import {skillsAttributes} from '../../db_models/sql/skills';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromBuffer } = require('file-type');

const candidateResolver: IResolvers = {
    Query: {
        meCandidate: async (_parent, _, context) => {
            try {
                checkAuthentication(context);
                const { user } = context;
                const candidate = await models.candidate.findOne({ user_id: user.id }).lean();
                if (!candidate) throw new UserNotFoundError();
                const formattedCandidate = await formatCandidate(candidate, { isSelf: true });

                return formattedCandidate;
            } catch (error) {
                throw new Error(`Failed to fetch applied jobs: ${error}`);
            }
        },
        getFeaturedJobs: async (_parent, {input}, context) => {
            const {
                limit,
                page
            } = input;
            const skip = (page - 1) * limit;
            const {user} = context;
            try {
                const [topJobIdsQuery] = (await sequelize.query(`
                    SELECT job_id
                    FROM applications
                    GROUP BY job_id
                    ORDER BY COUNT(*) DESC
                        LIMIT ${limit}
                    OFFSET ${skip};
                `)) as [Array<{ job_id: string }>, unknown];

                const topJobIds = topJobIdsQuery.map(row => row.job_id);
                console.log('day là topJobIds ', topJobIds);

                if (topJobIds.length === 0) {
                    return {
                        jobs: [],
                        pagination: {
                            total: 0,
                            page,
                            limit,
                            totalPages: 0
                        }
                    };
                }
                const dynamicFilter: {
                    job_id?: { $in: string[] };
                    Salary?: number;
                    'branches.city'?: string;
                    degree?: number;
                    job_categories?: { $in: number[] }
                } = {
                    job_id: {$in: topJobIds},
                };
                if (user) {
                    const candidate = await models.candidate.findOne({user_id: user.id}).lean();
                    const criteria = candidate?.job_selection_criteria;
                    if (criteria) {
                        if (criteria.salary) dynamicFilter.Salary = criteria.salary;
                        if (criteria.city_address) dynamicFilter['branches.city'] = criteria.city_address;
                        if (criteria.degree) dynamicFilter.degree = criteria.degree;
                        if (Array.isArray(criteria.job_categories) && criteria.job_categories.length > 0) {
                            dynamicFilter.job_categories = {$in: criteria.job_categories};
                        }
                    }
                }
                const query = 'SELECT COUNT(DISTINCT job_id) AS total FROM applications';
                const results = await sequelize.query<{ total: number }>(query, {
                    type: QueryTypes.SELECT,
                });
                const totalJobs = results[0]?.total ?? 0;
                const jobIdsInOrder: string[] = dynamicFilter.job_id?.$in ?? [];
                const jobs: IJob[] = await models.job.find(dynamicFilter).lean();

                const sortedJobs = jobIdsInOrder
                    .map(id => jobs.find(job => job.job_id === id))
                    .filter((job): job is IJob => job !== undefined);

                if (!sortedJobs.length) {
                    return {
                        jobs: [],
                        pagination: {
                            total: totalJobs,
                            page,
                            limit,
                            totalPages: Math.ceil(totalJobs / limit)
                        }
                    };
                }
                const skillIds = sortedJobs.flatMap(job => job.skills_required || []);
                const categoryIds = sortedJobs.flatMap(job => job.job_categories || []);

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
                    jobs: sortedJobs.map(job => mapJobToGraphQL(job, skills, jobCategories)),
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
        getFeaturedEmployers: async (_parent, {input}, context) => {
            const {limit, page} = input;
            const jobWeight = 0.6;
            const followerWeight = 0.4;

            try {
                const jobCounts = await models.job.aggregate([
                    {$match: {status: status_job.approved}},
                    {
                        $group: {
                            _id: '$employer_id',
                            job_count: {$sum: 1},
                        },
                    },
                ]);

                const followerCounts = await models.follow_employer.aggregate([
                    {
                        $group: {
                            _id: '$employer_id',
                            follower_count: {$sum: 1}
                        }
                    },
                    {
                        $project: {
                            employer_id: '$_id',
                            follower_count: 1,
                            _id: 0
                        }
                    }
                ]);

                const employerScores = new Map<number, number>();

                jobCounts.forEach(({_id, job_count}) => {
                    employerScores.set(_id, job_count * jobWeight);
                });

                followerCounts.forEach(({employer_id, follower_count}) => {
                    const currentScore = employerScores.get(employer_id) || 0;
                    employerScores.set(employer_id, currentScore + follower_count * followerWeight);
                });

                const totalEmployers = Array.from(employerScores.entries())
                    .sort((a, b) => b[1] - a[1])
                    .map(([employer_id]) => employer_id);

                const total = totalEmployers.length;
                const totalPages = Math.ceil(total / limit);
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                const topEmployers = totalEmployers.slice(startIndex, endIndex);

                if (topEmployers.length === 0)
                    return {
                        employerResult: [],
                        pagination: {total, page, limit, totalPages}
                    };

                const employers: IEmployer[] = await models.employer
                    .find({employer_id: {$in: topEmployers}, status: true})
                    .lean();

                const employerMap = new Map<number, IEmployer>(
                    employers.map(e => [e.employer_id, e])
                );

                const sortedEmployers: IEmployer[] = topEmployers
                    .map(id => employerMap.get(id))
                    .filter((e): e is IEmployer => Boolean(e));
                const userIds = sortedEmployers.map(e => e.user_id);
                const users = await db.users.findAll({
                    where: { user_id: userIds }
                });
                const userMap = new Map(users.map(user => [user.user_id, user]));
                const formattedEmployers = await Promise.all(
                    sortedEmployers
                        .filter(e => userMap.has(e.user_id)) // đảm bảo luôn có user
                        .map(async (employer) => {
                            const formatted = await formatEmployer(employer, { requesterRole: context.user.role });
                            return {
                                user: userMap.get(employer.user_id)!,
                                employer: formatted
                            };
                        })
                );

                return {
                    employerResult: formattedEmployers,
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages
                    }
                };

            } catch (error) {
                throw new Error(`Failed to fetch featured employers: ${error}`);
            }
        },
        getJobDetail: async (_parent, jobId, context) => {
            try {
                const {user} = context;
                const checkJob = await models.job.findOne({job_id: jobId.jobId}).lean();
                if (!checkJob) throw new AuthenticationError('Không tìm được job');
                if (checkJob.status === status_job.pending) {
                    if (!user || (user.role !== roleID.ADMIN && user.id !== checkJob.employer_id)) {
                        throw new AuthenticationError('Bạn không có quyền xem job này');
                    }
                }
                if (checkJob.status === status_job.closed) {
                    if (!user) {
                        throw new AuthenticationError('Bạn không có quyền xem job này');
                    }
                    if (user.role === roleID.ADMIN || user.id === checkJob.employer_id) { /* empty */
                    } else if (user.role === roleID.CANDIDATE) {
                        const candidate = await models.candidate.findOne({user_id: user.id});
                        if (!candidate) {
                            throw new AuthenticationError('Bạn không có quyền xem job này');
                        }
                        const hasApplied = await db.applications.findOne({
                            where: {
                                job_id: jobId,
                                candidate_id: candidate.candidate_id
                            }
                        });
                        if (!hasApplied) {
                            throw new AuthenticationError('Bạn không có quyền xem job này');
                        }
                    } else {
                        throw new AuthenticationError('Bạn không có quyền xem job này');
                    }
                }
                const skills: { skill_id: number; name: string }[] = checkJob.skills_required?.length
                    ? await db.skills.findAll({
                        where: {skill_id: {[Op.in]: checkJob.skills_required}},
                        attributes: ['skill_id', 'name'],
                        raw: true,
                    })
                    : [];
                const jobCategories: { category_id: number; name: string }[] = checkJob.job_categories?.length
                    ? await db.job_categories.findAll({
                        where: {category_id: {[Op.in]: checkJob.job_categories}},
                        attributes: ['category_id', 'name'],
                        raw: true,
                    })
                    : [];
                return mapJobToGraphQL(checkJob, skills, jobCategories);
            } catch (error) {
                throw new Error(`Failed to fetch job: ${error}`);
            }
        },
        searchJobs: async (_parent, {input}, context) => {
            const {
                degree,
                date,
                job_categories,
                Salary_min,
                Salary_Max,
                job_type,
                limit,
                page
            } = input;
            try {
                const dynamicFilter: any = {};
                dynamicFilter.status = status_job.approved;
                if (degree) dynamicFilter.degree = degree;
                if (date) dynamicFilter.date = date;
                if (job_categories) dynamicFilter.job_categories = {$in: [job_categories]};
                if (Salary_min !== undefined || Salary_Max !== undefined) {
                    dynamicFilter.Salary = {};
                    if (Salary_min !== undefined) dynamicFilter.Salary.$gte = Salary_min;
                    if (Salary_Max !== undefined) dynamicFilter.Salary.$lte = Salary_Max;
                }
                if (job_type) dynamicFilter.job_type =  job_type;

                const totalJobs = await models.job.countDocuments(dynamicFilter);
                const totalPages = Math.ceil(totalJobs / limit);
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                const jobs: IJob[] = await models.job.find(dynamicFilter)
                    .skip(startIndex)
                    .limit(limit)
                    .lean();
                const skillIds = jobs.flatMap(job => job.skills_required);
                const categoryIds = jobs.flatMap(job => job.job_categories);
                const skills = await db.skills.findAll({
                    where: {skill_id: {[Op.in]: skillIds}},
                    attributes: ['skill_id', 'name'],
                    raw: true,
                });

                const jobCategories = await db.job_categories.findAll({
                    where: {category_id: {[Op.in]: categoryIds}},
                    attributes: ['category_id', 'name'],
                    raw: true,
                });
                const jobData = jobs.map(job => mapJobToGraphQL(job, skills, jobCategories));
                return {
                    jobs: jobData,
                    pagination: {
                        total: totalJobs,
                        page,
                        limit,
                        totalPages,
                    }
                };

            } catch (error) {
                throw new Error(`Failed to search jobs: ${error}`);
            }
        },
        searchEmployers: async (_parent, {input}, context) => {
            try {
                const {
                    name_Employer,
                    city_address,
                    industries,
                    limit,
                    page
                } = input;

                const dynamicFilter: any = {};
                dynamicFilter.status = true;
                if (name_Employer) dynamicFilter.name_employer = {$regex: name_Employer, $options: 'i'};
                if (city_address) dynamicFilter['city_address.city_address'] = city_address;
                if (industries) {
                    const industryRecord = await db.industries.findOne({
                        where: {
                            industry_id: industries
                        },
                        raw: true
                    });

                    if (industryRecord) {
                        dynamicFilter.industry_id = {$in: [industryRecord.industry_id]};
                    }
                }


                const totalEmployers = await models.employer.countDocuments(dynamicFilter);


                const totalPages = Math.ceil(totalEmployers / limit);
                const startIndex = (page - 1) * limit;


                const employers: IEmployer[] = await models.employer.find(dynamicFilter)
                    .skip(startIndex)
                    .limit(limit)
                    .lean();
                const userIds = employers.map(e => e.user_id);
                const users = await db.users.findAll({
                    where: { user_id: userIds }
                });
                const userMap = new Map(users.map(user => [user.user_id, user]));
                const formattedEmployers = await Promise.all(
                    employers
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
                        totalPages,
                    }
                };

            } catch (error) {
                throw new Error(`Failed to fetch featured employers: ${error}`);
            }
        },
        getAppliedJobs: async (_parent, {input}, context) => {
            try {
                checkAuthentication(context);
                const {user} = context;
                if(user.role !== roleID.CANDIDATE) throw new AuthenticationError('');
                const {
                    limit,
                    page
                } = input;
                const {count, rows: applications} = await db.applications.findAndCountAll({
                    where: {
                        candidate_id: user.id
                    },
                    offset: (page - 1) * limit,
                    limit,
                    raw: true
                });

                if (count === 0) {
                    return {
                        jobs: [],
                        pagination: {
                            total: 0,
                            page,
                            limit,
                            totalPages: 0,
                        }
                    };
                }
                const jobIds = applications.map(app => app.job_id);
                const jobs = await models.job.find({job_id: {$in: jobIds}}).lean();
                const jobsWith = jobs.map(job => {
                    const application = applications.find(app => app.job_id === job.job_id);
                    return {
                        ...job,
                        status_application: application ? application.status : null,
                        applied_at_application: application ? application.applied_at : null
                    };
                });

                const skillIds = jobs.flatMap(job => job.skills_required);
                const categoryIds = jobs.flatMap(job => job.job_categories);
                const skills = await db.skills.findAll({
                    where: {skill_id: {[Op.in]: skillIds}},
                    attributes: ['skill_id', 'name'],
                    raw: true,
                });
                const jobCategories = await db.job_categories.findAll({
                    where: {category_id: {[Op.in]: categoryIds}},
                    attributes: ['category_id', 'name'],
                    raw: true,
                });
                const jobData = jobsWith.map(job => mapJobToGraphQL(job, skills, jobCategories));
                return {
                    jobs: jobData,
                    pagination: {
                        total: count,
                        page,
                        limit,
                        totalPages: Math.ceil(count / limit),
                    }
                };

            } catch (error) {
                throw new Error(`Failed to fetch applied jobs: ${error}`);
            }
        },
        getSavedJobs: async (_parent, {input}, context) => {
            try {
                checkAuthentication(context);
                const {user} = context;
                const {
                    limit,
                    page
                } = input;
                const follow_job = await models.follow_job
                    .find({candidate_id: user.id})
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean();

                const count = await models.follow_job.countDocuments({candidate_id: user.id});

                if (count === 0) {
                    return {
                        jobs: [],
                        pagination: {
                            total: 0,
                            page,
                            limit,
                            totalPages: 0,
                        }
                    };
                }
                const jobIds = follow_job.map(app => app.job_id);
                const jobs = await models.job.find({job_id: {$in: jobIds}}).lean();
                const skillIds = jobs.flatMap(job => job.skills_required);
                const categoryIds = jobs.flatMap(job => job.job_categories);
                const skills = await db.skills.findAll({
                    where: {skill_id: {[Op.in]: skillIds}},
                    attributes: ['skill_id', 'name'],
                    raw: true,
                });
                const jobCategories = await db.job_categories.findAll({
                    where: {category_id: {[Op.in]: categoryIds}},
                    attributes: ['category_id', 'name'],
                    raw: true,
                });
                console.log('day la job', jobs);
                const jobData = jobs.map(job => mapJobToGraphQL(job, skills, jobCategories));
                return {
                    jobs: jobData,
                    pagination: {
                        total: count,
                        page,
                        limit,
                        totalPages: Math.ceil(count / limit),
                    }
                };

            } catch (error) {
                throw new Error(`Failed to fetch applied jobs: ${error}`);
            }
        },
        getSavedEmployer: async (_parent, {input}, context) => {
            try {
                checkAuthentication(context);
                const {user} = context;
                if(user.role !== roleID.CANDIDATE) throw new AuthenticationError('');
                const {
                    limit,
                    page
                } = input;
                const follow_employer = await models.follow_employer
                    .find({candidate_id: user.id})
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .lean();

                const count = await models.follow_employer.countDocuments({candidate_id: user.id});

                if (count === 0) {
                    return {
                        employer: [],
                        pagination: {
                            total: 0,
                            page,
                            limit,
                            totalPages: 0,
                        }
                    };
                }
                const employerIds = follow_employer.map(app => app.employer_id);
                const employers = await models.employer.find({employer_id: {$in: employerIds}}).lean();
                const userIds = employers.map(e => e.user_id);
                const users = await db.users.findAll({
                    where: { user_id: userIds }
                });
                const userMap = new Map(users.map(user => [user.user_id, user]));
                const formattedEmployers = await Promise.all(
                    employers
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
                        total: count,
                        page,
                        limit,
                        totalPages: Math.ceil(count / limit),
                    }
                };

            } catch (error) {
                throw new Error(`Failed to fetch applied jobs: ${error}`);
            }
        },
    },
    Mutation: {
        upsertCandidate: async (_parent, {input}, context) => {
            try {
                checkAuthentication(context);
                const {user} = context;
                if(user.role !== roleID.CANDIDATE) throw new AuthenticationError('');
                const {
                    file_cv,
                    status,
                    job_selection_criteria,
                } = input;

                const {
                    salary,
                    city_address,
                    degree,
                    job_categories
                } = job_selection_criteria || {};

                if (file_cv) {
                    const {createReadStream, filename, mimetype} = await file_cv.promise;
                    const stream = createReadStream();
                    const buffer = await streamToBuffer(stream);

                    let detectedType = null;
                    const firstEightBytes = buffer.slice(0, 8).toString('ascii');
                    const firstEightBytesHex = buffer.slice(0, 8).toString('hex');

                    if (firstEightBytes.includes('%PDF')) {
                        detectedType = 'application/pdf';
                    } else if (firstEightBytesHex.startsWith('504b0304')) {
                        detectedType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                    } else if (firstEightBytesHex.startsWith('d0cf11e0')) {
                        detectedType = 'application/msword';
                    }

                    console.log('Detected type:', detectedType);

                    const allowed = [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                    ];

                    if (!detectedType || !allowed.includes(detectedType)) {
                        throw new Error('File không phải là CV hợp lệ (.pdf, .doc, .docx)');
                    }

                    await models.cvFile.deleteMany({candidate_id: user.id});
                    await models.cvFile.create({
                        candidate_id: user.id,
                        filename,
                        contentType: mimetype,
                        size: buffer.length,
                        data: buffer
                    });
                }
                await models.candidate.findOneAndUpdate(
                    {user_id: user.id},
                    {status, salary, city_address, degree, job_categories,job_selection_criteria},
                    {upsert: true, new: true}
                );
                return ISuccessResponse.Success;
            } catch (error) {
                throw new Error(`Cập nhật thất bại: ${error}`);
            }
        },
        toggleFollowJob: async (_parent, {input}, context) => {
            try {
                checkAuthentication(context);
                const {user} = context;
                if(user.role !== roleID.CANDIDATE) throw new AuthenticationError('');
                const {
                    job_id,
                    action
                } = input;
                const checkJob = await models.job.findOne({job_id}).lean();
                if (!checkJob) {
                    throw new Error('Job không tồn tại');
                }
                const checkFollowJob = await models.follow_job.findOne({
                    job_id,
                    candidate_id: user.id
                });
                console.log('day la checkFollowJob ', checkFollowJob);
                console.log('day la action ', action);
                if (!checkFollowJob) {
                    if (action) {
                        await models.follow_job.create({
                            candidate_id: user.id,
                            job_id
                        });
                    } else throw new Error('không thể bỏ follow nếu chưa follow');

                } else if (action) {
                    throw new Error('trước đây bạn đã follow công việc này ');
                } else await models.follow_job.deleteMany({
                    candidate_id: user.id,
                    job_id
                });
                return ISuccessResponse.Success;
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to upsert candidate: ${error}`);
            }
        },
        toggleFollowEmployer: async (_parent, {input}, context) => {
            try {
                checkAuthentication(context);
                const {user} = context;
                if(user.role !== roleID.CANDIDATE) throw new AuthenticationError('');
                const {
                    employer_id,
                    action
                } = input;
                const check_employer = await models.employer.findOne({employer_id}).lean();
                if (!check_employer) {
                    throw new Error('công ty không tồn tại');
                }
                const check_Follow_employer = await models.follow_employer.findOne({
                    employer_id,
                    candidate_id: user.id
                }).lean();
                if (!check_Follow_employer) {
                    if (action) {
                        await models.follow_employer.create({
                            candidate_id: user.id,
                            employer_id
                        });
                    } else throw new Error('không thể bỏ follow nếu chưa follow');

                } else if (action) {
                    throw new Error('trước đây bạn đã follow công ty này ');
                } else await models.follow_employer.deleteMany({
                    candidate_id: user.id,
                    employer_id
                });
                return ISuccessResponse.Success;
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to upsert candidate: ${error}`);
            }
        },
        apply_job: async (_parent, {jobId}, context) => {
            try {
                checkAuthentication(context);
                const {user} = context;
                if(user.role !== roleID.CANDIDATE) throw new AuthenticationError('');
                const check_candidate = await models.candidate.findOne({user_id : user.id});
                if(!check_candidate){
                    throw new AuthenticationError('ban khong co quyen');
                }
                const check_application = await db.applications.findOne({
                    where : {
                        job_id: jobId,
                        candidate_id: user.id
                    }
                });
                if(check_application){
                    throw new Error('ban da apply vao job nay truoc do');
                }
                await db.applications.create({
                    job_id: jobId,
                    candidate_id: user.id,
                    status: status_application.pending,
                });
                return ISuccessResponse.Success;
            } catch (error) {
                console.error(error);
                throw new Error(`Failed to upsert candidate: ${error}`);
            }
        }
    },
};
export default candidateResolver;
