// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

import importGraphqlString from 'import-graphql-string';
import { Tab } from '@apollographql/graphql-playground-html/dist/render-playground-page';
import { variables } from './variables';
import userResolver from '../schema/resolvers/userResolver';

const setUserAuthorization = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token = await userResolver.Query?.login({}, variables.login)
        .then((result: { token: any }) => result?.token)
        .catch((e: Error) => {
            console.error(e);
            return null;
        });
    const authHeader = token ? `Bearer ${token}` : '';

    return {
        authorization: authHeader,
    };
};

const defaultPath = `http://${process.env.SERVER_HOST || 'localhost'}:${
    process.env.SERVER_PORT || '4003'
}/graphql`;

const prettifyJsonString = (variable: any) => JSON.stringify(variable, null, 2);


// mutation user
const register = importGraphqlString('./mutations/register/register.graphql');
const forgot_password = importGraphqlString('./mutations/forgot_password/forgot_password.graphql');
const change_password = importGraphqlString('./mutations/change_password/change_password.graphql');
const update_profile = importGraphqlString('./mutations/update_profile/update_profile.graphql');

// query user
const login = importGraphqlString('./queries/login/login.graphql');
const getUserProfile = importGraphqlString('./queries/getUserProfile/getUserProfile.graphql');


// mutation candidate
const upsertCandidate = importGraphqlString('./mutations_candidate/upsertCandidate/upsertCandidate.graphql');
const toggleFollowJob = importGraphqlString('./mutations_candidate/toggleFollowJob/toggleFollowJob.graphql');
const toggleFollowEmployer = importGraphqlString('./mutations_candidate/toggleFollowEmployer/toggleFollowEmployer.graphql');
const apply_job = importGraphqlString('./mutations_candidate/apply_job/apply_job.graphql');

// query candidate
const meCandidate = importGraphqlString('./queries_candidate/meCandidate/meCandidate.graphql');
const getFeaturedJobs = importGraphqlString('./queries_candidate/getFeaturedJobs/getFeaturedJobs.graphql');
const getFeaturedEmployers = importGraphqlString('./queries_candidate/getFeaturedEmployers/getFeaturedEmployers.graphql');
const getJobDetail = importGraphqlString('./queries_candidate/getJobDetail/getJobDetail.graphql');
const searchJobs = importGraphqlString('./queries_candidate/searchJobs/searchJobs.graphql');
const searchEmployers = importGraphqlString('./queries_candidate/searchEmployers/searchEmployers.graphql');
const getAppliedJobs = importGraphqlString('./queries_candidate/getAppliedJobs/getAppliedJobs.graphql');
const getSavedJobs = importGraphqlString('./queries_candidate/getSavedJobs/getSavedJobs.graphql');
const getSavedEmployer = importGraphqlString('./queries_candidate/getSavedEmployer/getSavedEmployer.graphql');

// query employer
const meEmployer = importGraphqlString('./queries_employer/meEmployer/meEmployer.graphql');
const listJobByEmployer = importGraphqlString('./queries_employer/listJobByEmployer/listJobByEmployer.graphql');
const listApplicantsByJob = importGraphqlString('./queries_employer/listApplicantsByJob/listApplicantsByJob.graphql');
const listAllApplicantsByJob = importGraphqlString('./queries_employer/listAllApplicantsByJob/listAllApplicantsByJob.graphql');
const findCandidateByEmail = importGraphqlString('./queries_employer/findCandidateByEmail/findCandidateByEmail.graphql');


// mutation employer
const updateEmployerProfile = importGraphqlString('./mutations_employer/updateEmployerProfile/updateEmployerProfile.graphql');
const createJob = importGraphqlString('./mutations_employer/createJob/createJob.graphql');
const updateJob = importGraphqlString('./mutations_employer/updateJob/updateJob.graphql');
const updateApplicantStatus = importGraphqlString('./mutations_employer/updateApplicantStatus/updateApplicantStatus.graphql');
const deleteJob = importGraphqlString('./mutations_employer/deleteJob/deleteJob.graphql');



const listUsers = importGraphqlString('./queries_admin/listUsers/listUsers.graphql');
const findUserByEmail = importGraphqlString('./queries_admin/findUserByEmail/findUserByEmail.graphql');
const pendingEmployers = importGraphqlString('./queries_admin/pendingEmployers/pendingEmployers.graphql');
const getMasterData = importGraphqlString('./queries_admin/getMasterData/getMasterData.graphql');
const pendingJobs = importGraphqlString('./queries_admin/pendingJobs/pendingJobs.graphql');



const deleteUser = importGraphqlString('./mutations_admin/deleteUser/deleteUser.graphql');
const updateJobStatus = importGraphqlString('./mutations_admin/updateJobStatus/updateJobStatus.graphql');
const updateEmployerStatus = importGraphqlString('./mutations_admin/updateEmployerStatus/updateEmployerStatus.graphql');
const createMasterData = importGraphqlString('./mutations_admin/createMasterData/createMasterData.graphql');
const updateMasterData = importGraphqlString('./mutations_admin/updateMasterData/updateMasterData.graphql');
export const queryExample = async (
    path: string = defaultPath
): Promise<Tab[]> => {
    const userAuth = await setUserAuthorization();

    return [
        {
            endpoint: path,
            name: 'Đăng nhập',
            query: login,
            variables: prettifyJsonString(variables.login),
        },
        {
            endpoint: path,
            name: 'Đăng ký',
            query: register,
            variables: prettifyJsonString(variables.register),
        },
        {
            endpoint: path,
            name: ' quên mật khẩu ',
            query: forgot_password,
            variables: prettifyJsonString(variables.forgot_password),
        },
        {
            endpoint: path,
            name: ' Đổi mật khẩu  ',
            query: change_password,
            variables: prettifyJsonString(variables.change_password),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' getUserProfile  ',
            query: getUserProfile,
            variables: prettifyJsonString(variables.getUserProfile),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: 'update user',
            query: update_profile,
            variables: prettifyJsonString(variables.update_profile),
            headers: userAuth,
        },

        // query candidate
        {
            endpoint: path,
            name: ' get me  ',
            query: meCandidate,
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' job noi bat  ',
            query: getFeaturedJobs,
            variables: prettifyJsonString(variables.getFeaturedJobs),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' công ty nổi bật  ',
            query: getFeaturedEmployers,
            variables: prettifyJsonString(variables.getFeaturedEmployers),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' chi tiết job  ',
            query: getJobDetail,
            variables: prettifyJsonString(variables.getJobDetail),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' lọc job  ',
            query: searchJobs,
            variables: prettifyJsonString(variables.searchJobs),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' lọc công ty  ',
            query: searchEmployers,
            variables: prettifyJsonString(variables.searchEmployers),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' job đã ứng tuyển  ',
            query: getAppliedJobs,
            variables: prettifyJsonString(variables.getAppliedJobs),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' job đã lưu  ',
            query: getSavedJobs,
            variables: prettifyJsonString(variables.getSavedJobs),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' employer đã lưu  ',
            query: getSavedEmployer,
            variables: prettifyJsonString(variables.getSavedEmployer),
            headers: userAuth,
        },
        // mutation candidate


        {
            endpoint: path,
            name: ' update ứng viên ',
            query: upsertCandidate,
            variables: prettifyJsonString(variables.upsertCandidate),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' follow hoặc bỏ fl job ',
            query: toggleFollowJob,
            variables: prettifyJsonString(variables.toggleFollowJob),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: 'follow hoặc bỏ fl cng ty ',
            query: toggleFollowEmployer,
            variables: prettifyJsonString(variables.toggleFollowEmployer),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: 'apply job',
            query: apply_job,
            variables: prettifyJsonString(variables.apply_job),
            headers: userAuth,
        },

        // query employer
        {
            endpoint: path,
            name: ' meEmployer  ',
            query: meEmployer,
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' laays job theo status  ',
            query: listJobByEmployer,
            variables: prettifyJsonString(variables.listJobByEmployer),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' lấy ứng viên theo job  ',
            query: listApplicantsByJob,
            variables: prettifyJsonString(variables.listApplicantsByJob),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' lấy tất cả ứng viên ',
            query: listAllApplicantsByJob,
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' findCandidateByEmail ',
            query: findCandidateByEmail,
            variables: prettifyJsonString(variables.findCandidateByEmail),
            headers: userAuth,
        },

        // mutation employer
        {
            endpoint: path,
            name: ' update ployer  ',
            query: updateEmployerProfile,
            variables: prettifyJsonString(variables.updateEmployerProfile),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' tạo job  ',
            query: createJob,
            variables: prettifyJsonString(variables.createJob),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' update job  ',
            query: updateJob,
            variables: prettifyJsonString(variables.updateJob),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' update status application  ',
            query: updateApplicantStatus,
            variables: prettifyJsonString(variables.updateApplicantStatus),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' xóa job  ',
            query: deleteJob,
            variables: prettifyJsonString(variables.deleteJob),
            headers: userAuth,
        },


        {
            endpoint: path,
            name: ' listUsers  ',
            query: listUsers,
            variables: prettifyJsonString(variables.listUsers),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' findUserByEmail  ',
            query: findUserByEmail,
            variables: prettifyJsonString(variables.findUserByEmail),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' pendingEmployers  ',
            query: pendingEmployers,
            variables: prettifyJsonString(variables.pendingEmployers),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' getMasterData  ',
            query: getMasterData,
            variables: prettifyJsonString(variables.getMasterData),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' pendingJobs  ',
            query: pendingJobs,
            variables: prettifyJsonString(variables.pendingJobs),
            headers: userAuth,
        },



        {
            endpoint: path,
            name: ' deleteUser ',
            query: deleteUser,
            variables: prettifyJsonString(variables.deleteUser),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' updateJobStatus ',
            query: updateJobStatus,
            variables: prettifyJsonString(variables.updateJobStatus),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' updateEmployerStatus ',
            query: updateEmployerStatus,
            variables: prettifyJsonString(variables.updateEmployerStatus),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: 'createMasterData  ',
            query: createMasterData,
            variables: prettifyJsonString(variables.createMasterData),
            headers: userAuth,
        },
        {
            endpoint: path,
            name: ' updateMasterData  ',
            query: updateMasterData,
            variables: prettifyJsonString(variables.updateMasterData),
            headers: userAuth,
        },

    ];
};
