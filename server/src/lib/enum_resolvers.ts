import {Readable} from 'stream';
import { Op } from 'sequelize';
import { db,  } from '../db_loaders/mysql';
import { models } from '../db_loaders/mongodb';
import { roleID, status_job, status_application, type_job, degree  } from './enum';
import { InValidRoleError,
} from './classes/graphqlErrors';
import {IJob} from '../db_models/no_sql/job';
import {app} from '../config/appConfig';
import { industriesAttributes } from '../db_models/sql/industries';
import { Ibranchs } from '../db_models/no_sql/employer';


export const iRoleToNumber = (role: number) => {
    switch (role) {
        case 0:
            return roleID.ADMIN;
        case 1:
            return roleID.CANDIDATE;
        case 2:
            return roleID.EMPLOYER;
        default:
            throw new InValidRoleError();
    }
};

export const Status_Job_ToNumber = (role: number) => {
    switch (role) {
        case 0:
            return status_job.pending;
        case 1:
            return status_job.approved;
        case 2:
            return status_job.approved;
        case 3:
            return status_job.rejected;
        default:
            throw new InValidRoleError();
    }
};

export const Status_Application_ToNumber = (role: number) => {
    switch (role) {
        case 0:
            return status_application.pending;
        case 1:
            return status_application.interview;
        case 2:
            return status_application.rejected;
        default:
            throw new InValidRoleError();
    }
};
export const type_job_ToNumber = (role: number) => {
    switch (role) {
        case 0:
            return type_job.full_time;
        case 1:
            return type_job.part_time;
        case 2:
            return type_job.contract;
        case 3:
            return type_job.intern;
        case 4:
            return type_job.freelance;
        case 5:
            return type_job.temporary;
        case 6:
            return type_job.remote;
        default:
            throw new InValidRoleError();
    }
};

export const type_degree_ToNumber = (role: number) => {
    switch (role) {
        case 0:
            return degree.intern;
        case 1:
            return degree.staff;
        case 2:
            return degree.group_leader;
        case 3:
            return degree.manage;
        case 4:
            return degree.supervisory;
        case 5:
            return degree.senior_position;
        default:
            throw new InValidRoleError();
    }
};

export const mapJobToGraphQL = (
    job: IJob,
    skills: { skill_id: number; name: string }[],
    jobCategories: { category_id: number; name: string }[]
) => ({
    ...job,
    job_type: job.job_type,
    status: job.status,
    skills_required: job.skills_required.map(id => {
        const skill = skills.find(s => s.skill_id === id);
        return {
            skill_id: id,
            name: skill?.name || `Skill ${id}`,
        };
    }),
    job_categories: job.job_categories.map(id => {
        const category = jobCategories.find(c => c.category_id === id);
        return {
            category_id: id,
            name: category?.name || `Category ${id}`,
        };
    }),
    branches: job.branches || [],
});
export const streamToBuffer = (stream: Readable): Promise<Buffer> =>new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });

export const formatCandidate = async (
    candidate: any,
    options: { isSelf?: boolean; requesterRole?: number; isRequesterEmployer?: boolean } = {}
) => {
    const { isSelf, requesterRole, isRequesterEmployer } = options;


    const {user_id} = candidate;

    const check_fileCV = await models.cvFile.findOne({ candidate_id: user_id }).lean();
    const Url_CV = check_fileCV ? `http://${app.host}:${app.port}/CvFile/${user_id}` : undefined;

    const skills: any[] = candidate.skills?.length
        ? await db.skills
              .findAll({
                  where: { skill_id: candidate.skills },
                  attributes: ['skill_id', 'name'],
              })
              .then((skills: any[]) =>
                  skills.map((skill) => ({
                      skill_id: skill.skill_id,
                      name: skill.name,
                  }))
              )
        : [];

    let jobSelectionCriteria;
    if (candidate.job_selection_criteria) {
        jobSelectionCriteria = {
            salary: candidate.job_selection_criteria.salary,
            city_address: candidate.job_selection_criteria.city_address,
            degree: candidate.job_selection_criteria.degree,
            job_categories: candidate.job_selection_criteria.job_categories?.length
                ? await db.job_categories
                    .findAll({
                        where: {
                            category_id: {
                                [Op.in]: candidate.job_selection_criteria.job_categories,
                            },
                        },
                        attributes: ['category_id', 'name'],
                    })
                    .then((categories: any[]) =>
                        categories.map((cat) => ({
                            category_id: cat.category_id,
                            name: cat.name,
                        }))
                    )
                : []

        };
    }

    const experiences = Array.isArray(candidate.experience) ? candidate.experience : [];

    const industryIds = experiences
        .map((exp: { industry_id: any }) => exp.industry_id)
        .filter((id: any): id is number => typeof id === 'number');

    const industriesMap = industryIds.length
        ? await db.industries
              .findAll({
                  where: { industry_id: industryIds },
                  attributes: ['industry_id', 'name'],
              })
              .then((industries: any[]) =>
                  industries.reduce(
                      (map, item) => {
                          // eslint-disable-next-line no-param-reassign
                          map[item.industry_id] = item.name;
                          return map;
                      },
                      {} as Record<number, string>
                  )
              )
        : {};

    const experienceWithIndustry = experiences.map(
        (exp: { industry_id: string | number }) => ({
            ...exp,
            industry:
                exp.industry_id && industriesMap[exp.industry_id]
                    ? {
                          industry_id: exp.industry_id,
                          name: industriesMap[exp.industry_id],
                      }
                    : null,
        })
    );
    console.log('experienceWithIndustry', experienceWithIndustry);
    const common = {
        skills,
        experience: experienceWithIndustry,
        cv_url: Url_CV,
        job_selection_criteria: jobSelectionCriteria,
    };

    if (isSelf || requesterRole === roleID.ADMIN) {
        return {
            ...candidate,
            ...common,
        };
    } if (isRequesterEmployer) {
        return {
            user_id: candidate.user_id,
            candidate_id: candidate.candidate_id,
            status: candidate.status,
            total_experience_years: candidate.total_experience_years,
            ...common,
        };
    }
    return null;

};





export const formatEmployer = async (
    employer: any,
    options: { isSelf?: boolean; requesterRole?: number } = {}
) => {
    const { isSelf, requesterRole } = options;
    const industry: industriesAttributes[] = employer.industry_id?.length
        ? await db.industries
              .findAll({
                  where: { industry_id: employer.industry_id },
                  attributes: ['industry_id', 'name'],
              })
              // eslint-disable-next-line no-shadow
              .then((industry) =>
                  // eslint-disable-next-line no-shadow
                  industry.map((industry) => ({
                      industry_id: industry.industry_id,
                      name: industry.name,
                  }))
              )
        : [];
    const branches: Ibranchs[] =
        employer.branches?.map((branch: any) => ({
            id: branch.id,
            name: branch.name,
            specific_address: branch.specific_address,
            city: branch.city,
        })) || [];

    if (isSelf || requesterRole === roleID.ADMIN) {
        return {
            employer_id: employer.employer_id,
            user_id: employer.user_id,
            name_employer: employer.name_employer,
            industry,
            social_links: employer.social_links,
            description: employer.description,
            number_of_employees: employer.number_of_employees,
            branches,
            city_address: employer.city_address,
            interest: employer.interest,
            status: employer.status,
            updated_at: employer.updated_at,
        };
    }
    return {
        user_id: employer.user_id,
        employer_id: employer.employer_id,
        name_employer: employer.name_employer,
        description: employer.description,
        social_links: employer.social_links,
        industry,
        branches,
        interest: employer.interest,
        number_of_employees: employer.number_of_employees,
        city_address: employer.city_address,
    };
};

