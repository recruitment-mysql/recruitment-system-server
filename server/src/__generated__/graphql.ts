import {
    GraphQLResolveInfo,
    GraphQLScalarType,
    GraphQLScalarTypeConfig,
} from 'graphql';
import { users } from '../db_models/sql/init-models';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
    T extends { [key: string]: unknown },
    K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends ' $fragmentName' | '__typename'
              ? T[P]
              : never;
      };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
    [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    Cursor: { input: any; output: any };
    Date: { input: any; output: any };
    JSON: { input: any; output: any };
    Upload: { input: any; output: any };
};

export type IApplicant = {
    __typename?: 'Applicant';
    applied_at: Scalars['Date']['output'];
    candidateProfile: ICandidate;
    status: Scalars['Int']['output'];
    user: IUser;
};

export type IBranch = {
    __typename?: 'Branch';
    city: Scalars['String']['output'];
    id: Scalars['Int']['output'];
    name: Scalars['String']['output'];
    specific_address: Scalars['String']['output'];
};

export type ICandidate = {
    __typename?: 'Candidate';
    candidate_id: Scalars['Int']['output'];
    cv_url?: Maybe<Scalars['String']['output']>;
    experience?: Maybe<Array<Maybe<ICandidateExperience>>>;
    job_selection_criteria?: Maybe<IJob_Selection_Criteria_Schema>;
    skills?: Maybe<Array<Maybe<ISkill>>>;
    status?: Maybe<Scalars['Boolean']['output']>;
    total_experience_years?: Maybe<Scalars['Int']['output']>;
    updated_at?: Maybe<Scalars['Date']['output']>;
    user_id: Scalars['Int']['output'];
};

export type ICandidateExperience = {
    __typename?: 'CandidateExperience';
    company: Scalars['String']['output'];
    industry?: Maybe<IIndustry>;
    role: Scalars['String']['output'];
    years: Scalars['Int']['output'];
};

export type ICreateJobInput = {
    Salary: Scalars['Int']['input'];
    branches: Array<InputMaybe<Scalars['Int']['input']>>;
    degree: Scalars['Int']['input'];
    description: Scalars['String']['input'];
    experience_years_required: Scalars['Int']['input'];
    foreign_language?: InputMaybe<Scalars['String']['input']>;
    job_categories: Array<InputMaybe<Scalars['Int']['input']>>;
    job_type: Scalars['Int']['input'];
    quantity: Scalars['Int']['input'];
    skills_required: Array<InputMaybe<Scalars['Int']['input']>>;
    title: Scalars['String']['input'];
};

export type ICreateUserInput = {
    avatar?: InputMaybe<Scalars['Upload']['input']>;
    email: Scalars['String']['input'];
    full_name: Scalars['String']['input'];
    number_phone: Scalars['String']['input'];
    password: Scalars['String']['input'];
    role: Scalars['Int']['input'];
};

export type IEmployer = {
    __typename?: 'Employer';
    branches?: Maybe<Array<Maybe<IBranch>>>;
    city_address?: Maybe<ITypeHeadquarters>;
    description?: Maybe<Scalars['String']['output']>;
    employer_id: Scalars['Int']['output'];
    industry?: Maybe<Array<Maybe<IIndustry>>>;
    interest?: Maybe<IInterest>;
    name_employer?: Maybe<Scalars['String']['output']>;
    number_of_employees?: Maybe<Scalars['Int']['output']>;
    social_links?: Maybe<ISocialLinks>;
    status?: Maybe<Scalars['Boolean']['output']>;
    updated_at?: Maybe<Scalars['Date']['output']>;
    user_id: Scalars['Int']['output'];
};

export type IEmployerResult = {
    __typename?: 'EmployerResult';
    employer: IEmployer;
    user: IUser;
};

export type IEmployerResultOutPut = {
    __typename?: 'EmployerResultOutPut';
    employerResult?: Maybe<Array<Maybe<IEmployerResult>>>;
    pagination: IPagination_Result;
};

export type IExperience = {
    company?: InputMaybe<Scalars['String']['input']>;
    industry_id?: InputMaybe<Scalars['Int']['input']>;
    role?: InputMaybe<Scalars['String']['input']>;
    years?: InputMaybe<Scalars['String']['input']>;
};

export type IIndustry = {
    __typename?: 'Industry';
    industry_id: Scalars['Int']['output'];
    name: Scalars['String']['output'];
};

export type IInterest = {
    __typename?: 'Interest';
    award?: Maybe<Scalars['String']['output']>;
    insurance?: Maybe<Scalars['String']['output']>;
    salary?: Maybe<Scalars['String']['output']>;
};

export type IJobsResult = {
    __typename?: 'JobsResult';
    jobs: Array<Maybe<IJob>>;
    pagination: IPagination_Result;
};

export type IMasterData = {
    __typename?: 'MasterData';
    industry?: Maybe<Array<Maybe<IIndustry>>>;
    job_category?: Maybe<Array<Maybe<IJob_Categories>>>;
    skill?: Maybe<Array<Maybe<ISkill>>>;
};

export type IMasterDataInput = {
    name: Scalars['String']['input'];
    type: IMasterDataType;
};

export type IMasterDataResult = {
    __typename?: 'MasterDataResult';
    id: Scalars['ID']['output'];
    name: Scalars['String']['output'];
};

export enum IMasterDataType {
    Industry = 'INDUSTRY',
    JobCategory = 'JOB_CATEGORY',
    Skill = 'SKILL',
}

export type IMutation = {
    __typename?: 'Mutation';
    apply_job: ISuccessResponse;
    change_password: ISuccessResponse;
    createJob: ISuccessResponse;
    createMasterData: ISuccessResponse;
    deleteJob: ISuccessResponse;
    deleteUser: ISuccessResponse;
    forgot_password: ISuccessResponse;
    register: IUser;
    registerAdmin: IUser;
    toggleFollowEmployer: ISuccessResponse;
    toggleFollowJob: ISuccessResponse;
    updateApplicantStatus: ISuccessResponse;
    updateEmployerProfile: ISuccessResponse;
    updateEmployerStatus: ISuccessResponse;
    updateJob: ISuccessResponse;
    updateJobStatus: ISuccessResponse;
    updateMasterData: ISuccessResponse;
    update_profile: ISuccessResponse;
    upsertCandidate: ISuccessResponse;
};

export type IMutationApply_JobArgs = {
    jobId: Scalars['ID']['input'];
};

export type IMutationChange_PasswordArgs = {
    input: IChange_Password_Input;
};

export type IMutationCreateJobArgs = {
    input: ICreateJobInput;
};

export type IMutationCreateMasterDataArgs = {
    input: IMasterDataInput;
};

export type IMutationDeleteJobArgs = {
    jobId: Scalars['ID']['input'];
};

export type IMutationDeleteUserArgs = {
    user_id: Scalars['ID']['input'];
};

export type IMutationForgot_PasswordArgs = {
    input: IForgot_Password_Input;
};

export type IMutationRegisterArgs = {
    input: ICreateUserInput;
};

export type IMutationRegisterAdminArgs = {
    input: ICreateUserInput;
};

export type IMutationToggleFollowEmployerArgs = {
    input: IToggleFollowEmployerInput;
};

export type IMutationToggleFollowJobArgs = {
    input: IToggleFollowJob;
};

export type IMutationUpdateApplicantStatusArgs = {
    input: IUpdateApplicantStatusInput;
};

export type IMutationUpdateEmployerProfileArgs = {
    input: IUpdateEmployerInput;
};

export type IMutationUpdateEmployerStatusArgs = {
    employerId: Scalars['ID']['input'];
    status: Scalars['Boolean']['input'];
};

export type IMutationUpdateJobArgs = {
    input: IUpdateJobInput;
};

export type IMutationUpdateJobStatusArgs = {
    jobId: Scalars['ID']['input'];
    status: Scalars['Int']['input'];
};

export type IMutationUpdateMasterDataArgs = {
    id: Scalars['ID']['input'];
    input: IMasterDataInput;
};

export type IMutationUpdate_ProfileArgs = {
    input: IUpdate_Profile;
};

export type IMutationUpsertCandidateArgs = {
    input: IUpsertCandidateInput;
};

export type IPageInfo = {
    __typename?: 'PageInfo';
    endCursor?: Maybe<Scalars['Cursor']['output']>;
    hasNextPage: Scalars['Boolean']['output'];
};

export type IPaginationInput = {
    after?: InputMaybe<Scalars['Cursor']['input']>;
    before?: InputMaybe<Scalars['Cursor']['input']>;
    first?: InputMaybe<Scalars['Int']['input']>;
    last?: InputMaybe<Scalars['Int']['input']>;
};

export type IQuery = {
    __typename?: 'Query';
    findCandidateByEmail: IUserProfile;
    findUserByEmail: IUserProfile;
    getAppliedJobs: IJobsResult;
    getFeaturedEmployers: IEmployerResultOutPut;
    getFeaturedJobs: IJobsResult;
    getJobDetail?: Maybe<IJob>;
    getMasterData: IMasterData;
    getSavedEmployer: IEmployerResultOutPut;
    getSavedJobs: IJobsResult;
    getUserProfile?: Maybe<IUserProfile>;
    greeting: Scalars['String']['output'];
    listAllApplicantsByJob?: Maybe<Array<Maybe<IApplicant>>>;
    listApplicantsByJob?: Maybe<Array<Maybe<IApplicant>>>;
    listJobByEmployer: IJobsResult;
    listUsers: IListUsers;
    login: IUserLoginResponse;
    meCandidate: ICandidate;
    meEmployer: IEmployer;
    pendingEmployers: IEmployerResultOutPut;
    pendingJobs: IJobsResult;
    searchEmployers: IEmployerResultOutPut;
    searchJobs: IJobsResult;
};

export type IQueryFindCandidateByEmailArgs = {
    email: Scalars['String']['input'];
};

export type IQueryFindUserByEmailArgs = {
    email: Scalars['String']['input'];
};

export type IQueryGetAppliedJobsArgs = {
    input: IPagination;
};

export type IQueryGetFeaturedEmployersArgs = {
    input: IPagination;
};

export type IQueryGetFeaturedJobsArgs = {
    input: IPagination;
};

export type IQueryGetJobDetailArgs = {
    jobId: Scalars['String']['input'];
};

export type IQueryGetMasterDataArgs = {
    type: IMasterDataType;
};

export type IQueryGetSavedEmployerArgs = {
    input: IPagination;
};

export type IQueryGetSavedJobsArgs = {
    input: IPagination;
};

export type IQueryGetUserProfileArgs = {
    user_id: Scalars['Int']['input'];
};

export type IQueryListApplicantsByJobArgs = {
    jobId: Scalars['ID']['input'];
};

export type IQueryListJobByEmployerArgs = {
    input: IListJobByEmployerInput;
};

export type IQueryListUsersArgs = {
    input: IListUsersInput;
};

export type IQueryLoginArgs = {
    input: IUserLoginInput;
};

export type IQueryPendingEmployersArgs = {
    input: IPagination;
};

export type IQueryPendingJobsArgs = {
    input: IPagination;
};

export type IQuerySearchEmployersArgs = {
    input: ISearchEmployers;
};

export type IQuerySearchJobsArgs = {
    input: ISearchJobs;
};

export type ISkill = {
    __typename?: 'Skill';
    name: Scalars['String']['output'];
    skill_id: Scalars['Int']['output'];
};

export type ISocialLinks = {
    __typename?: 'SocialLinks';
    facebook?: Maybe<Scalars['String']['output']>;
    linkedin?: Maybe<Scalars['String']['output']>;
    website?: Maybe<Scalars['String']['output']>;
};

export enum ISuccessResponse {
    Success = 'success',
}

export type ITypeHeadquarters = {
    __typename?: 'TypeHeadquarters';
    city_address: Scalars['String']['output'];
    specific_address: Scalars['String']['output'];
};

export type IUpdateApplicantStatusInput = {
    candidateId: Scalars['Int']['input'];
    jobId: Scalars['String']['input'];
    status: Scalars['Int']['input'];
};

export type IUpdateEmployerInput = {
    description?: InputMaybe<Scalars['String']['input']>;
    headquarters?: InputMaybe<IHeadquarters>;
    industry_id?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
    number_of_employees?: InputMaybe<Scalars['Int']['input']>;
    social_links_Facebook?: InputMaybe<Scalars['String']['input']>;
    social_links_Website?: InputMaybe<Scalars['String']['input']>;
    social_links_Youtube?: InputMaybe<Scalars['String']['input']>;
};

export type IUpdateJobInput = {
    Salary?: InputMaybe<Scalars['Int']['input']>;
    branches?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
    degree?: InputMaybe<Scalars['Int']['input']>;
    description?: InputMaybe<Scalars['String']['input']>;
    experience_years_required?: InputMaybe<Scalars['Int']['input']>;
    foreign_language?: InputMaybe<Scalars['String']['input']>;
    jobId: Scalars['ID']['input'];
    job_categories?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
    job_type?: InputMaybe<Scalars['Int']['input']>;
    quantity?: InputMaybe<Scalars['Int']['input']>;
    skills_required?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
    status?: InputMaybe<Scalars['Int']['input']>;
    title?: InputMaybe<Scalars['String']['input']>;
};

export type IUpsertCandidateInput = {
    Experience?: InputMaybe<IExperience>;
    file_cv?: InputMaybe<Scalars['Upload']['input']>;
    job_selection_criteria?: InputMaybe<IJob_Selection_Criteria>;
    status?: InputMaybe<Scalars['Boolean']['input']>;
};

export type IUser = {
    __typename?: 'User';
    avatar?: Maybe<Scalars['String']['output']>;
    created_at?: Maybe<Scalars['Date']['output']>;
    email?: Maybe<Scalars['String']['output']>;
    full_name: Scalars['String']['output'];
    number_phone?: Maybe<Scalars['String']['output']>;
    role: Scalars['Int']['output'];
    updated_at?: Maybe<Scalars['Date']['output']>;
    user_id: Scalars['Int']['output'];
};

export type IUserLoginInput = {
    email: Scalars['String']['input'];
    password: Scalars['String']['input'];
};

export type IUserLoginResponse = {
    __typename?: 'UserLoginResponse';
    token: Scalars['String']['output'];
    user: IUser;
};

export type IUserProfile = {
    __typename?: 'UserProfile';
    candidateProfile?: Maybe<ICandidate>;
    employerProfile?: Maybe<IEmployer>;
    user: IUser;
};

export type IChange_Password_Input = {
    password_new: Scalars['String']['input'];
    password_old: Scalars['String']['input'];
};

export type IForgot_Password_Input = {
    email: Scalars['String']['input'];
};

export type IHeadquarters = {
    city_address: Scalars['String']['input'];
    specific_address: Scalars['String']['input'];
};

export type IJob = {
    __typename?: 'job';
    Salary: Scalars['Int']['output'];
    applied_at_application?: Maybe<Scalars['Date']['output']>;
    branches: Array<Maybe<IBranch>>;
    created_at?: Maybe<Scalars['Date']['output']>;
    degree: Scalars['Int']['output'];
    description: Scalars['String']['output'];
    employer_id: Scalars['Int']['output'];
    experience_years_required: Scalars['Int']['output'];
    foreign_language?: Maybe<Scalars['String']['output']>;
    job_categories: Array<Maybe<IJob_Categories>>;
    job_id: Scalars['String']['output'];
    job_type: Scalars['Int']['output'];
    quantity: Scalars['Int']['output'];
    skills_required: Array<Maybe<ISkill>>;
    status: Scalars['Int']['output'];
    status_application?: Maybe<Scalars['String']['output']>;
    title: Scalars['String']['output'];
    updated_at?: Maybe<Scalars['Date']['output']>;
};

export type IJob_Categories = {
    __typename?: 'job_categories';
    category_id: Scalars['Int']['output'];
    name: Scalars['String']['output'];
};

export type IJob_Selection_Criteria = {
    city_address?: InputMaybe<Scalars['String']['input']>;
    degree?: InputMaybe<Scalars['Int']['input']>;
    job_categories?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
    salary?: InputMaybe<Scalars['String']['input']>;
};

export type IJob_Selection_Criteria_Schema = {
    __typename?: 'job_selection_criteria_Schema';
    city_address?: Maybe<Scalars['String']['output']>;
    degree?: Maybe<Scalars['Int']['output']>;
    job_categories?: Maybe<Array<Maybe<IJob_Categories>>>;
    salary?: Maybe<Scalars['Int']['output']>;
};

export type IListJobByEmployerInput = {
    limit: Scalars['Int']['input'];
    page: Scalars['Int']['input'];
    status: Scalars['Int']['input'];
};

export type IListUsers = {
    __typename?: 'listUsers';
    information: Array<Maybe<IUserProfile>>;
    pagination: IPagination_Result;
};

export type IListUsersInput = {
    limit: Scalars['Int']['input'];
    page: Scalars['Int']['input'];
    role: Scalars['Int']['input'];
};

export type IPagination = {
    limit: Scalars['Int']['input'];
    page: Scalars['Int']['input'];
};

export type IPagination_Result = {
    __typename?: 'pagination_Result';
    limit: Scalars['Int']['output'];
    page: Scalars['Int']['output'];
    total: Scalars['Int']['output'];
    totalPages: Scalars['Int']['output'];
};

export type ISearchEmployers = {
    city_address?: InputMaybe<Scalars['String']['input']>;
    industries?: InputMaybe<Scalars['Int']['input']>;
    limit: Scalars['Int']['input'];
    name_Employer?: InputMaybe<Scalars['String']['input']>;
    page: Scalars['Int']['input'];
};

export type ISearchJobs = {
    Salary_Max?: InputMaybe<Scalars['Int']['input']>;
    Salary_min?: InputMaybe<Scalars['Int']['input']>;
    date?: InputMaybe<Scalars['Int']['input']>;
    degree?: InputMaybe<Scalars['Int']['input']>;
    job_categories?: InputMaybe<Scalars['Int']['input']>;
    job_type?: InputMaybe<Scalars['Int']['input']>;
    limit: Scalars['Int']['input'];
    page: Scalars['Int']['input'];
};

export type IToggleFollowEmployerInput = {
    action: Scalars['Boolean']['input'];
    employer_id: Scalars['Int']['input'];
};

export type IToggleFollowJob = {
    action: Scalars['Boolean']['input'];
    job_id: Scalars['String']['input'];
};

export type IUpdate_Profile = {
    avatar?: InputMaybe<Scalars['Upload']['input']>;
    name?: InputMaybe<Scalars['String']['input']>;
    number_phone?: InputMaybe<Scalars['String']['input']>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
    | ResolverFn<TResult, TParent, TContext, TArgs>
    | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
    TResult,
    TKey extends string,
    TParent,
    TContext,
    TArgs,
> {
    subscribe: SubscriptionSubscribeFn<
        { [key in TKey]: TResult },
        TParent,
        TContext,
        TArgs
    >;
    resolve?: SubscriptionResolveFn<
        TResult,
        { [key in TKey]: TResult },
        TContext,
        TArgs
    >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
    TResult,
    TKey extends string,
    TParent,
    TContext,
    TArgs,
> =
    | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
    | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
    TResult,
    TKey extends string,
    TParent = {},
    TContext = {},
    TArgs = {},
> =
    | ((
          ...args: any[]
      ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
    | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
    parent: TParent,
    context: TContext,
    info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
    obj: T,
    context: TContext,
    info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
    TResult = {},
    TParent = {},
    TContext = {},
    TArgs = {},
> = (
    next: NextResolverFn<TResult>,
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type IResolversTypes = {
    Applicant: ResolverTypeWrapper<
        Omit<IApplicant, 'user'> & { user: IResolversTypes['User'] }
    >;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
    Branch: ResolverTypeWrapper<IBranch>;
    Candidate: ResolverTypeWrapper<ICandidate>;
    CandidateExperience: ResolverTypeWrapper<ICandidateExperience>;
    CreateJobInput: ICreateJobInput;
    CreateUserInput: ICreateUserInput;
    Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
    Date: ResolverTypeWrapper<Scalars['Date']['output']>;
    Employer: ResolverTypeWrapper<IEmployer>;
    EmployerResult: ResolverTypeWrapper<
        Omit<IEmployerResult, 'user'> & { user: IResolversTypes['User'] }
    >;
    EmployerResultOutPut: ResolverTypeWrapper<
        Omit<IEmployerResultOutPut, 'employerResult'> & {
            employerResult?: Maybe<
                Array<Maybe<IResolversTypes['EmployerResult']>>
            >;
        }
    >;
    Experience: IExperience;
    ID: ResolverTypeWrapper<Scalars['ID']['output']>;
    Industry: ResolverTypeWrapper<IIndustry>;
    Int: ResolverTypeWrapper<Scalars['Int']['output']>;
    Interest: ResolverTypeWrapper<IInterest>;
    JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
    JobsResult: ResolverTypeWrapper<IJobsResult>;
    MasterData: ResolverTypeWrapper<IMasterData>;
    MasterDataInput: IMasterDataInput;
    MasterDataResult: ResolverTypeWrapper<IMasterDataResult>;
    MasterDataType: IMasterDataType;
    Mutation: ResolverTypeWrapper<{}>;
    PageInfo: ResolverTypeWrapper<IPageInfo>;
    PaginationInput: IPaginationInput;
    Query: ResolverTypeWrapper<{}>;
    Skill: ResolverTypeWrapper<ISkill>;
    SocialLinks: ResolverTypeWrapper<ISocialLinks>;
    String: ResolverTypeWrapper<Scalars['String']['output']>;
    SuccessResponse: ISuccessResponse;
    TypeHeadquarters: ResolverTypeWrapper<ITypeHeadquarters>;
    UpdateApplicantStatusInput: IUpdateApplicantStatusInput;
    UpdateEmployerInput: IUpdateEmployerInput;
    UpdateJobInput: IUpdateJobInput;
    Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
    UpsertCandidateInput: IUpsertCandidateInput;
    User: ResolverTypeWrapper<users>;
    UserLoginInput: IUserLoginInput;
    UserLoginResponse: ResolverTypeWrapper<
        Omit<IUserLoginResponse, 'user'> & { user: IResolversTypes['User'] }
    >;
    UserProfile: ResolverTypeWrapper<
        Omit<IUserProfile, 'user'> & { user: IResolversTypes['User'] }
    >;
    change_password_Input: IChange_Password_Input;
    forgot_password_input: IForgot_Password_Input;
    headquarters: IHeadquarters;
    job: ResolverTypeWrapper<IJob>;
    job_categories: ResolverTypeWrapper<IJob_Categories>;
    job_selection_criteria: IJob_Selection_Criteria;
    job_selection_criteria_Schema: ResolverTypeWrapper<IJob_Selection_Criteria_Schema>;
    listJobByEmployerInput: IListJobByEmployerInput;
    listUsers: ResolverTypeWrapper<
        Omit<IListUsers, 'information'> & {
            information: Array<Maybe<IResolversTypes['UserProfile']>>;
        }
    >;
    listUsersInput: IListUsersInput;
    pagination: IPagination;
    pagination_Result: ResolverTypeWrapper<IPagination_Result>;
    searchEmployers: ISearchEmployers;
    searchJobs: ISearchJobs;
    toggleFollowEmployerInput: IToggleFollowEmployerInput;
    toggleFollowJob: IToggleFollowJob;
    update_profile: IUpdate_Profile;
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
    Applicant: Omit<IApplicant, 'user'> & {
        user: IResolversParentTypes['User'];
    };
    Boolean: Scalars['Boolean']['output'];
    Branch: IBranch;
    Candidate: ICandidate;
    CandidateExperience: ICandidateExperience;
    CreateJobInput: ICreateJobInput;
    CreateUserInput: ICreateUserInput;
    Cursor: Scalars['Cursor']['output'];
    Date: Scalars['Date']['output'];
    Employer: IEmployer;
    EmployerResult: Omit<IEmployerResult, 'user'> & {
        user: IResolversParentTypes['User'];
    };
    EmployerResultOutPut: Omit<IEmployerResultOutPut, 'employerResult'> & {
        employerResult?: Maybe<
            Array<Maybe<IResolversParentTypes['EmployerResult']>>
        >;
    };
    Experience: IExperience;
    ID: Scalars['ID']['output'];
    Industry: IIndustry;
    Int: Scalars['Int']['output'];
    Interest: IInterest;
    JSON: Scalars['JSON']['output'];
    JobsResult: IJobsResult;
    MasterData: IMasterData;
    MasterDataInput: IMasterDataInput;
    MasterDataResult: IMasterDataResult;
    Mutation: {};
    PageInfo: IPageInfo;
    PaginationInput: IPaginationInput;
    Query: {};
    Skill: ISkill;
    SocialLinks: ISocialLinks;
    String: Scalars['String']['output'];
    TypeHeadquarters: ITypeHeadquarters;
    UpdateApplicantStatusInput: IUpdateApplicantStatusInput;
    UpdateEmployerInput: IUpdateEmployerInput;
    UpdateJobInput: IUpdateJobInput;
    Upload: Scalars['Upload']['output'];
    UpsertCandidateInput: IUpsertCandidateInput;
    User: users;
    UserLoginInput: IUserLoginInput;
    UserLoginResponse: Omit<IUserLoginResponse, 'user'> & {
        user: IResolversParentTypes['User'];
    };
    UserProfile: Omit<IUserProfile, 'user'> & {
        user: IResolversParentTypes['User'];
    };
    change_password_Input: IChange_Password_Input;
    forgot_password_input: IForgot_Password_Input;
    headquarters: IHeadquarters;
    job: IJob;
    job_categories: IJob_Categories;
    job_selection_criteria: IJob_Selection_Criteria;
    job_selection_criteria_Schema: IJob_Selection_Criteria_Schema;
    listJobByEmployerInput: IListJobByEmployerInput;
    listUsers: Omit<IListUsers, 'information'> & {
        information: Array<Maybe<IResolversParentTypes['UserProfile']>>;
    };
    listUsersInput: IListUsersInput;
    pagination: IPagination;
    pagination_Result: IPagination_Result;
    searchEmployers: ISearchEmployers;
    searchJobs: ISearchJobs;
    toggleFollowEmployerInput: IToggleFollowEmployerInput;
    toggleFollowJob: IToggleFollowJob;
    update_profile: IUpdate_Profile;
};

export type IApplicantResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Applicant'] = IResolversParentTypes['Applicant'],
> = {
    applied_at?: Resolver<IResolversTypes['Date'], ParentType, ContextType>;
    candidateProfile?: Resolver<
        IResolversTypes['Candidate'],
        ParentType,
        ContextType
    >;
    status?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    user?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IBranchResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Branch'] = IResolversParentTypes['Branch'],
> = {
    city?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    specific_address?: Resolver<
        IResolversTypes['String'],
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICandidateResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Candidate'] = IResolversParentTypes['Candidate'],
> = {
    candidate_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    cv_url?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    experience?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['CandidateExperience']>>>,
        ParentType,
        ContextType
    >;
    job_selection_criteria?: Resolver<
        Maybe<IResolversTypes['job_selection_criteria_Schema']>,
        ParentType,
        ContextType
    >;
    skills?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['Skill']>>>,
        ParentType,
        ContextType
    >;
    status?: Resolver<
        Maybe<IResolversTypes['Boolean']>,
        ParentType,
        ContextType
    >;
    total_experience_years?: Resolver<
        Maybe<IResolversTypes['Int']>,
        ParentType,
        ContextType
    >;
    updated_at?: Resolver<
        Maybe<IResolversTypes['Date']>,
        ParentType,
        ContextType
    >;
    user_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ICandidateExperienceResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['CandidateExperience'] = IResolversParentTypes['CandidateExperience'],
> = {
    company?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    industry?: Resolver<
        Maybe<IResolversTypes['Industry']>,
        ParentType,
        ContextType
    >;
    role?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    years?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface ICursorScalarConfig
    extends GraphQLScalarTypeConfig<IResolversTypes['Cursor'], any> {
    name: 'Cursor';
}

export interface IDateScalarConfig
    extends GraphQLScalarTypeConfig<IResolversTypes['Date'], any> {
    name: 'Date';
}

export type IEmployerResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Employer'] = IResolversParentTypes['Employer'],
> = {
    branches?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['Branch']>>>,
        ParentType,
        ContextType
    >;
    city_address?: Resolver<
        Maybe<IResolversTypes['TypeHeadquarters']>,
        ParentType,
        ContextType
    >;
    description?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    employer_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    industry?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['Industry']>>>,
        ParentType,
        ContextType
    >;
    interest?: Resolver<
        Maybe<IResolversTypes['Interest']>,
        ParentType,
        ContextType
    >;
    name_employer?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    number_of_employees?: Resolver<
        Maybe<IResolversTypes['Int']>,
        ParentType,
        ContextType
    >;
    social_links?: Resolver<
        Maybe<IResolversTypes['SocialLinks']>,
        ParentType,
        ContextType
    >;
    status?: Resolver<
        Maybe<IResolversTypes['Boolean']>,
        ParentType,
        ContextType
    >;
    updated_at?: Resolver<
        Maybe<IResolversTypes['Date']>,
        ParentType,
        ContextType
    >;
    user_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IEmployerResultResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['EmployerResult'] = IResolversParentTypes['EmployerResult'],
> = {
    employer?: Resolver<IResolversTypes['Employer'], ParentType, ContextType>;
    user?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IEmployerResultOutPutResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['EmployerResultOutPut'] = IResolversParentTypes['EmployerResultOutPut'],
> = {
    employerResult?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['EmployerResult']>>>,
        ParentType,
        ContextType
    >;
    pagination?: Resolver<
        IResolversTypes['pagination_Result'],
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IIndustryResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Industry'] = IResolversParentTypes['Industry'],
> = {
    industry_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IInterestResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Interest'] = IResolversParentTypes['Interest'],
> = {
    award?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
    insurance?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    salary?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IJsonScalarConfig
    extends GraphQLScalarTypeConfig<IResolversTypes['JSON'], any> {
    name: 'JSON';
}

export type IJobsResultResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['JobsResult'] = IResolversParentTypes['JobsResult'],
> = {
    jobs?: Resolver<
        Array<Maybe<IResolversTypes['job']>>,
        ParentType,
        ContextType
    >;
    pagination?: Resolver<
        IResolversTypes['pagination_Result'],
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMasterDataResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['MasterData'] = IResolversParentTypes['MasterData'],
> = {
    industry?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['Industry']>>>,
        ParentType,
        ContextType
    >;
    job_category?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['job_categories']>>>,
        ParentType,
        ContextType
    >;
    skill?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['Skill']>>>,
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMasterDataResultResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['MasterDataResult'] = IResolversParentTypes['MasterDataResult'],
> = {
    id?: Resolver<IResolversTypes['ID'], ParentType, ContextType>;
    name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IMutationResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation'],
> = {
    apply_job?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationApply_JobArgs, 'jobId'>
    >;
    change_password?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationChange_PasswordArgs, 'input'>
    >;
    createJob?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationCreateJobArgs, 'input'>
    >;
    createMasterData?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationCreateMasterDataArgs, 'input'>
    >;
    deleteJob?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationDeleteJobArgs, 'jobId'>
    >;
    deleteUser?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationDeleteUserArgs, 'user_id'>
    >;
    forgot_password?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationForgot_PasswordArgs, 'input'>
    >;
    register?: Resolver<
        IResolversTypes['User'],
        ParentType,
        ContextType,
        RequireFields<IMutationRegisterArgs, 'input'>
    >;
    registerAdmin?: Resolver<
        IResolversTypes['User'],
        ParentType,
        ContextType,
        RequireFields<IMutationRegisterAdminArgs, 'input'>
    >;
    toggleFollowEmployer?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationToggleFollowEmployerArgs, 'input'>
    >;
    toggleFollowJob?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationToggleFollowJobArgs, 'input'>
    >;
    updateApplicantStatus?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationUpdateApplicantStatusArgs, 'input'>
    >;
    updateEmployerProfile?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationUpdateEmployerProfileArgs, 'input'>
    >;
    updateEmployerStatus?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<
            IMutationUpdateEmployerStatusArgs,
            'employerId' | 'status'
        >
    >;
    updateJob?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationUpdateJobArgs, 'input'>
    >;
    updateJobStatus?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationUpdateJobStatusArgs, 'jobId' | 'status'>
    >;
    updateMasterData?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationUpdateMasterDataArgs, 'id' | 'input'>
    >;
    update_profile?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationUpdate_ProfileArgs, 'input'>
    >;
    upsertCandidate?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationUpsertCandidateArgs, 'input'>
    >;
};

export type IPageInfoResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['PageInfo'] = IResolversParentTypes['PageInfo'],
> = {
    endCursor?: Resolver<
        Maybe<IResolversTypes['Cursor']>,
        ParentType,
        ContextType
    >;
    hasNextPage?: Resolver<IResolversTypes['Boolean'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IQueryResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Query'] = IResolversParentTypes['Query'],
> = {
    findCandidateByEmail?: Resolver<
        IResolversTypes['UserProfile'],
        ParentType,
        ContextType,
        RequireFields<IQueryFindCandidateByEmailArgs, 'email'>
    >;
    findUserByEmail?: Resolver<
        IResolversTypes['UserProfile'],
        ParentType,
        ContextType,
        RequireFields<IQueryFindUserByEmailArgs, 'email'>
    >;
    getAppliedJobs?: Resolver<
        IResolversTypes['JobsResult'],
        ParentType,
        ContextType,
        RequireFields<IQueryGetAppliedJobsArgs, 'input'>
    >;
    getFeaturedEmployers?: Resolver<
        IResolversTypes['EmployerResultOutPut'],
        ParentType,
        ContextType,
        RequireFields<IQueryGetFeaturedEmployersArgs, 'input'>
    >;
    getFeaturedJobs?: Resolver<
        IResolversTypes['JobsResult'],
        ParentType,
        ContextType,
        RequireFields<IQueryGetFeaturedJobsArgs, 'input'>
    >;
    getJobDetail?: Resolver<
        Maybe<IResolversTypes['job']>,
        ParentType,
        ContextType,
        RequireFields<IQueryGetJobDetailArgs, 'jobId'>
    >;
    getMasterData?: Resolver<
        IResolversTypes['MasterData'],
        ParentType,
        ContextType,
        RequireFields<IQueryGetMasterDataArgs, 'type'>
    >;
    getSavedEmployer?: Resolver<
        IResolversTypes['EmployerResultOutPut'],
        ParentType,
        ContextType,
        RequireFields<IQueryGetSavedEmployerArgs, 'input'>
    >;
    getSavedJobs?: Resolver<
        IResolversTypes['JobsResult'],
        ParentType,
        ContextType,
        RequireFields<IQueryGetSavedJobsArgs, 'input'>
    >;
    getUserProfile?: Resolver<
        Maybe<IResolversTypes['UserProfile']>,
        ParentType,
        ContextType,
        RequireFields<IQueryGetUserProfileArgs, 'user_id'>
    >;
    greeting?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    listAllApplicantsByJob?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['Applicant']>>>,
        ParentType,
        ContextType
    >;
    listApplicantsByJob?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['Applicant']>>>,
        ParentType,
        ContextType,
        RequireFields<IQueryListApplicantsByJobArgs, 'jobId'>
    >;
    listJobByEmployer?: Resolver<
        IResolversTypes['JobsResult'],
        ParentType,
        ContextType,
        RequireFields<IQueryListJobByEmployerArgs, 'input'>
    >;
    listUsers?: Resolver<
        IResolversTypes['listUsers'],
        ParentType,
        ContextType,
        RequireFields<IQueryListUsersArgs, 'input'>
    >;
    login?: Resolver<
        IResolversTypes['UserLoginResponse'],
        ParentType,
        ContextType,
        RequireFields<IQueryLoginArgs, 'input'>
    >;
    meCandidate?: Resolver<
        IResolversTypes['Candidate'],
        ParentType,
        ContextType
    >;
    meEmployer?: Resolver<IResolversTypes['Employer'], ParentType, ContextType>;
    pendingEmployers?: Resolver<
        IResolversTypes['EmployerResultOutPut'],
        ParentType,
        ContextType,
        RequireFields<IQueryPendingEmployersArgs, 'input'>
    >;
    pendingJobs?: Resolver<
        IResolversTypes['JobsResult'],
        ParentType,
        ContextType,
        RequireFields<IQueryPendingJobsArgs, 'input'>
    >;
    searchEmployers?: Resolver<
        IResolversTypes['EmployerResultOutPut'],
        ParentType,
        ContextType,
        RequireFields<IQuerySearchEmployersArgs, 'input'>
    >;
    searchJobs?: Resolver<
        IResolversTypes['JobsResult'],
        ParentType,
        ContextType,
        RequireFields<IQuerySearchJobsArgs, 'input'>
    >;
};

export type ISkillResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Skill'] = IResolversParentTypes['Skill'],
> = {
    name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    skill_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ISocialLinksResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['SocialLinks'] = IResolversParentTypes['SocialLinks'],
> = {
    facebook?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    linkedin?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    website?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ITypeHeadquartersResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['TypeHeadquarters'] = IResolversParentTypes['TypeHeadquarters'],
> = {
    city_address?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    specific_address?: Resolver<
        IResolversTypes['String'],
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface IUploadScalarConfig
    extends GraphQLScalarTypeConfig<IResolversTypes['Upload'], any> {
    name: 'Upload';
}

export type IUserResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['User'] = IResolversParentTypes['User'],
> = {
    avatar?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    created_at?: Resolver<
        Maybe<IResolversTypes['Date']>,
        ParentType,
        ContextType
    >;
    email?: Resolver<Maybe<IResolversTypes['String']>, ParentType, ContextType>;
    full_name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    number_phone?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    role?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    updated_at?: Resolver<
        Maybe<IResolversTypes['Date']>,
        ParentType,
        ContextType
    >;
    user_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserLoginResponseResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['UserLoginResponse'] = IResolversParentTypes['UserLoginResponse'],
> = {
    token?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    user?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IUserProfileResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['UserProfile'] = IResolversParentTypes['UserProfile'],
> = {
    candidateProfile?: Resolver<
        Maybe<IResolversTypes['Candidate']>,
        ParentType,
        ContextType
    >;
    employerProfile?: Resolver<
        Maybe<IResolversTypes['Employer']>,
        ParentType,
        ContextType
    >;
    user?: Resolver<IResolversTypes['User'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJobResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['job'] = IResolversParentTypes['job'],
> = {
    Salary?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    applied_at_application?: Resolver<
        Maybe<IResolversTypes['Date']>,
        ParentType,
        ContextType
    >;
    branches?: Resolver<
        Array<Maybe<IResolversTypes['Branch']>>,
        ParentType,
        ContextType
    >;
    created_at?: Resolver<
        Maybe<IResolversTypes['Date']>,
        ParentType,
        ContextType
    >;
    degree?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    description?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    employer_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    experience_years_required?: Resolver<
        IResolversTypes['Int'],
        ParentType,
        ContextType
    >;
    foreign_language?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    job_categories?: Resolver<
        Array<Maybe<IResolversTypes['job_categories']>>,
        ParentType,
        ContextType
    >;
    job_id?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    job_type?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    quantity?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    skills_required?: Resolver<
        Array<Maybe<IResolversTypes['Skill']>>,
        ParentType,
        ContextType
    >;
    status?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    status_application?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    title?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    updated_at?: Resolver<
        Maybe<IResolversTypes['Date']>,
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJob_CategoriesResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['job_categories'] = IResolversParentTypes['job_categories'],
> = {
    category_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IJob_Selection_Criteria_SchemaResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['job_selection_criteria_Schema'] = IResolversParentTypes['job_selection_criteria_Schema'],
> = {
    city_address?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    degree?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
    job_categories?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['job_categories']>>>,
        ParentType,
        ContextType
    >;
    salary?: Resolver<Maybe<IResolversTypes['Int']>, ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IListUsersResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['listUsers'] = IResolversParentTypes['listUsers'],
> = {
    information?: Resolver<
        Array<Maybe<IResolversTypes['UserProfile']>>,
        ParentType,
        ContextType
    >;
    pagination?: Resolver<
        IResolversTypes['pagination_Result'],
        ParentType,
        ContextType
    >;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IPagination_ResultResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['pagination_Result'] = IResolversParentTypes['pagination_Result'],
> = {
    limit?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    page?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    total?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    totalPages?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IResolvers<ContextType = any> = {
    Applicant?: IApplicantResolvers<ContextType>;
    Branch?: IBranchResolvers<ContextType>;
    Candidate?: ICandidateResolvers<ContextType>;
    CandidateExperience?: ICandidateExperienceResolvers<ContextType>;
    Cursor?: GraphQLScalarType;
    Date?: GraphQLScalarType;
    Employer?: IEmployerResolvers<ContextType>;
    EmployerResult?: IEmployerResultResolvers<ContextType>;
    EmployerResultOutPut?: IEmployerResultOutPutResolvers<ContextType>;
    Industry?: IIndustryResolvers<ContextType>;
    Interest?: IInterestResolvers<ContextType>;
    JSON?: GraphQLScalarType;
    JobsResult?: IJobsResultResolvers<ContextType>;
    MasterData?: IMasterDataResolvers<ContextType>;
    MasterDataResult?: IMasterDataResultResolvers<ContextType>;
    Mutation?: IMutationResolvers<ContextType>;
    PageInfo?: IPageInfoResolvers<ContextType>;
    Query?: IQueryResolvers<ContextType>;
    Skill?: ISkillResolvers<ContextType>;
    SocialLinks?: ISocialLinksResolvers<ContextType>;
    TypeHeadquarters?: ITypeHeadquartersResolvers<ContextType>;
    Upload?: GraphQLScalarType;
    User?: IUserResolvers<ContextType>;
    UserLoginResponse?: IUserLoginResponseResolvers<ContextType>;
    UserProfile?: IUserProfileResolvers<ContextType>;
    job?: IJobResolvers<ContextType>;
    job_categories?: IJob_CategoriesResolvers<ContextType>;
    job_selection_criteria_Schema?: IJob_Selection_Criteria_SchemaResolvers<ContextType>;
    listUsers?: IListUsersResolvers<ContextType>;
    pagination_Result?: IPagination_ResultResolvers<ContextType>;
};
