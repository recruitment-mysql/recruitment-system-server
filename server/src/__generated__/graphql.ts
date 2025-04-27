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

export type ICreateUserInput = {
    avarta?: InputMaybe<Scalars['Upload']['input']>;
    email: Scalars['String']['input'];
    full_name: Scalars['String']['input'];
    password: Scalars['String']['input'];
    role: Scalars['Int']['input'];
};

export type IMutation = {
    __typename?: 'Mutation';
    register: IUser;
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
    greeting: Scalars['String']['output'];
    login: IUserLoginResponse;
    users?: Maybe<Array<Maybe<IUser>>>;
};

export type IQueryLoginArgs = {
    input: IUserLoginInput;
};

export enum ISuccessResponse {
    Success = 'success',
}

export type IUser = {
    __typename?: 'User';
    avarta?: Maybe<Scalars['String']['output']>;
    created_at?: Maybe<Scalars['Date']['output']>;
    email: Scalars['String']['output'];
    full_name?: Maybe<Scalars['String']['output']>;
    password_hash: Scalars['String']['output'];
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
    CreateUserInput: ICreateUserInput;
    Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
    Date: ResolverTypeWrapper<Scalars['Date']['output']>;
    Int: ResolverTypeWrapper<Scalars['Int']['output']>;
    JSON: ResolverTypeWrapper<Scalars['JSON']['output']>;
    Mutation: ResolverTypeWrapper<{}>;
    PageInfo: ResolverTypeWrapper<IPageInfo>;
    PaginationInput: IPaginationInput;
    Query: ResolverTypeWrapper<{}>;
    String: ResolverTypeWrapper<Scalars['String']['output']>;
    SuccessResponse: ISuccessResponse;
    Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
    User: ResolverTypeWrapper<users>;
    UserLoginInput: IUserLoginInput;
    UserLoginResponse: ResolverTypeWrapper<
        Omit<IUserLoginResponse, 'user'> & { user: IResolversTypes['User'] }
    >;
};

/** Mapping between all available schema types and the resolvers parents */
export type IResolversParentTypes = {
    Boolean: Scalars['Boolean']['output'];
    CreateUserInput: ICreateUserInput;
    Cursor: Scalars['Cursor']['output'];
    Date: Scalars['Date']['output'];
    Int: Scalars['Int']['output'];
    JSON: Scalars['JSON']['output'];
    Mutation: {};
    PageInfo: IPageInfo;
    PaginationInput: IPaginationInput;
    Query: {};
    String: Scalars['String']['output'];
    Upload: Scalars['Upload']['output'];
    User: users;
    UserLoginInput: IUserLoginInput;
    UserLoginResponse: Omit<IUserLoginResponse, 'user'> & {
        user: IResolversParentTypes['User'];
    };
};

export interface ICursorScalarConfig
    extends GraphQLScalarTypeConfig<IResolversTypes['Cursor'], any> {
    name: 'Cursor';
}

export interface IDateScalarConfig
    extends GraphQLScalarTypeConfig<IResolversTypes['Date'], any> {
    name: 'Date';
}

export interface IJsonScalarConfig
    extends GraphQLScalarTypeConfig<IResolversTypes['JSON'], any> {
    name: 'JSON';
}

export type IMutationResolvers<
    ContextType = any,
    ParentType extends
        IResolversParentTypes['Mutation'] = IResolversParentTypes['Mutation'],
> = {
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
    greeting?: Resolver<IResolversTypes['String'], ParentType, ContextType>;
    login?: Resolver<
        IResolversTypes['UserLoginResponse'],
        ParentType,
        ContextType,
        RequireFields<IQueryLoginArgs, 'input'>
    >;
    users?: Resolver<
        Maybe<Array<Maybe<IResolversTypes['User']>>>,
        ParentType,
        ContextType
    >;
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
    avarta?: Resolver<
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
    password_hash?: Resolver<
        IResolversTypes['String'],
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

export type IResolvers<ContextType = any> = {
    Cursor?: GraphQLScalarType;
    Date?: GraphQLScalarType;
    JSON?: GraphQLScalarType;
    Mutation?: IMutationResolvers<ContextType>;
    PageInfo?: IPageInfoResolvers<ContextType>;
    Query?: IQueryResolvers<ContextType>;
    Upload?: GraphQLScalarType;
    User?: IUserResolvers<ContextType>;
    UserLoginResponse?: IUserLoginResponseResolvers<ContextType>;
};
