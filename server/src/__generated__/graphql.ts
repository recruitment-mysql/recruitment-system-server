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

export type IBranch = {
    __typename?: 'Branch';
    name: Scalars['String']['output'];
    specific_address: Scalars['Int']['output'];
};

export type ICandidate = {
    __typename?: 'Candidate';
    candidate_id: Scalars['String']['output'];
    cv_url?: Maybe<Scalars['String']['output']>;
    degree?: Maybe<IDegree>;
    experience?: Maybe<Array<ICandidateExperience>>;
    skills?: Maybe<Array<ISkill>>;
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

export type ICreateUserInput = {
    avarta?: InputMaybe<Scalars['Upload']['input']>;
    email: Scalars['String']['input'];
    full_name: Scalars['String']['input'];
    password: Scalars['String']['input'];
    role: Scalars['Int']['input'];
};

export type IDegree = {
    __typename?: 'Degree';
    degree_id: Scalars['Int']['output'];
    name: Scalars['String']['output'];
};

export type IEmployer = {
    __typename?: 'Employer';
    branches?: Maybe<Array<IBranch>>;
    city_address?: Maybe<Scalars['String']['output']>;
    description?: Maybe<Scalars['String']['output']>;
    employer_id: Scalars['String']['output'];
    industry?: Maybe<IIndustry>;
    interest?: Maybe<IInterest>;
    number_of_employees?: Maybe<Scalars['Int']['output']>;
    social_links?: Maybe<ISocialLinks>;
    status?: Maybe<Scalars['Boolean']['output']>;
    updated_at?: Maybe<Scalars['Date']['output']>;
    user_id: Scalars['Int']['output'];
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

export type IMutation = {
    __typename?: 'Mutation';
    change_password: ISuccessResponse;
    forgot_password: ISuccessResponse;
    register: IUser;
};

export type IMutationChange_PasswordArgs = {
    input: IChange_Password_Input;
};

export type IMutationForgot_PasswordArgs = {
    input: IForgot_Password_Input;
};

export type IMutationRegisterArgs = {
    input: ICreateUserInput;
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
    getUserProfile?: Maybe<IUserProfile>;
    greeting: Scalars['String']['output'];
    login: IUserLoginResponse;
};

export type IQueryGetUserProfileArgs = {
    user_id: Scalars['Int']['input'];
};

export type IQueryLoginArgs = {
    input: IUserLoginInput;
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

export type IUser = {
    __typename?: 'User';
    avatar?: Maybe<Scalars['String']['output']>;
    created_at?: Maybe<Scalars['Date']['output']>;
    email: Scalars['String']['output'];
    full_name?: Maybe<Scalars['String']['output']>;
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
    info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
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
    info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
    obj: T,
    context: TContext,
    info: GraphQLResolveInfo,
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
    info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type IResolversTypes = {
    Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
    Branch: ResolverTypeWrapper<IBranch>;
    Candidate: ResolverTypeWrapper<ICandidate>;
    CandidateExperience: ResolverTypeWrapper<ICandidateExperience>;
    CreateUserInput: ICreateUserInput;
    Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
    Date: ResolverTypeWrapper<Scalars['Date']['output']>;
    Degree: ResolverTypeWrapper<IDegree>;
    Employer: ResolverTypeWrapper<IEmployer>;
    Industry: ResolverTypeWrapper<IIndustry>;
    Int: ResolverTypeWrapper<Scalars['Int']['output']>;
    Interest: ResolverTypeWrapper<IInterest>;
    JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
    Mutation: ResolverTypeWrapper<{}>;
    PageInfo: ResolverTypeWrapper<IPageInfo>;
    PaginationInput: IPaginationInput;
    Query: ResolverTypeWrapper<{}>;
    Skill: ResolverTypeWrapper<ISkill>;
    SocialLinks: ResolverTypeWrapper<ISocialLinks>;
    String: ResolverTypeWrapper<Scalars['String']['output']>;
    SuccessResponse: ISuccessResponse;
    Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
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
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
    Boolean: Scalars['Boolean']['output'];
    Branch: IBranch;
    Candidate: ICandidate;
    CandidateExperience: ICandidateExperience;
    CreateUserInput: ICreateUserInput;
    Cursor: Scalars['Cursor']['output'];
    Date: Scalars['Date']['output'];
    Degree: IDegree;
    Employer: IEmployer;
    Industry: IIndustry;
    Int: Scalars['Int']['output'];
    Interest: IInterest;
    JSON: Scalars['JSON']['output'];
    Mutation: {};
    PageInfo: IPageInfo;
    PaginationInput: IPaginationInput;
    Query: {};
    Skill: ISkill;
    SocialLinks: ISocialLinks;
    String: Scalars['String']['output'];
    Upload: Scalars['Upload']['output'];
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
};

export type IBranchResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Branch'] = IResolversParentTypes['Branch'],
> = {
    name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    specific_address?: Resolver<
        IResolversTypes['Int'],
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
    candidate_id?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    cv_url?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    degree?: Resolver<
        Maybe<IResolversTypes['Degree']>,
        ParentType,
        ContextType
    >;
    experience?: Resolver<
        Maybe<Array<IResolversTypes['CandidateExperience']>>,
        ParentType,
        ContextType
    >;
    skills?: Resolver<
        Maybe<Array<IResolversTypes['Skill']>>,
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

export type IDegreeResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Degree'] = IResolversParentTypes['Degree'],
> = {
    degree_id?: Resolver<IResolversTypes['Int'], ParentType, ContextType>;
    name?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IEmployerResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Employer'] = IResolversParentTypes['Employer'],
> = {
    branches?: Resolver<
        Maybe<Array<IResolversTypes['Branch']>>,
        ParentType,
        ContextType
    >;
    city_address?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    description?: Resolver<
        Maybe<IResolversTypes['String']>,
        ParentType,
        ContextType
    >;
    employer_id?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    industry?: Resolver<
        Maybe<IResolversTypes['Industry']>,
        ParentType,
        ContextType
    >;
    interest?: Resolver<
        Maybe<IResolversTypes['Interest']>,
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

export type IMutationResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation'],
> = {
    change_password?: Resolver<
        IResolversTypes['SuccessResponse'],
        ParentType,
        ContextType,
        RequireFields<IMutationChange_PasswordArgs, 'input'>
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
    getUserProfile?: Resolver<
        Maybe<IResolversTypes['UserProfile']>,
        ParentType,
        ContextType,
        RequireFields<IQueryGetUserProfileArgs, 'user_id'>
    >;
    greeting?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    login?: Resolver<
        IResolversTypes['UserLoginResponse'],
        ParentType,
        ContextType,
        RequireFields<IQueryLoginArgs, 'input'>
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
    email?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    full_name?: Resolver<
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

export type IResolvers<ContextType = any> = {
    Branch?: IBranchResolvers<ContextType>;
    Candidate?: ICandidateResolvers<ContextType>;
    CandidateExperience?: ICandidateExperienceResolvers<ContextType>;
    Cursor?: GraphQLScalarType;
    Date?: GraphQLScalarType;
    Degree?: IDegreeResolvers<ContextType>;
    Employer?: IEmployerResolvers<ContextType>;
    Industry?: IIndustryResolvers<ContextType>;
    Interest?: IInterestResolvers<ContextType>;
    JSON?: GraphQLScalarType;
    Mutation?: IMutationResolvers<ContextType>;
    PageInfo?: IPageInfoResolvers<ContextType>;
    Query?: IQueryResolvers<ContextType>;
    Skill?: ISkillResolvers<ContextType>;
    SocialLinks?: ISocialLinksResolvers<ContextType>;
    Upload?: GraphQLScalarType;
    User?: IUserResolvers<ContextType>;
    UserLoginResponse?: IUserLoginResponseResolvers<ContextType>;
    UserProfile?: IUserProfileResolvers<ContextType>;
};
