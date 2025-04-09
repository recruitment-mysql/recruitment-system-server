/* eslint-disable no-shadow */
import { GraphQLError } from 'graphql';

export enum Chat_ERROR_CODE {
    Unauthenticated = 'Unauthenticated',
    UserNotFound = 'UserNotFound',
    UserAlreadyExist = 'UserAlreadyExist',
    InValidRole = 'InValidRole',
    MySQL = 'MySQL',
    TaskNotAllowUpdate ='TaskNotAllowUpdate'
}

export class AuthenticationError extends GraphQLError {
    constructor(message: string | null) {
        super(message || 'Lỗi xác thực quyền truy cập của người dùng', {
            extensions: {
                code: Chat_ERROR_CODE.Unauthenticated,
            },
        });
    }
}

export class UserNotFoundError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Người dùng không tồn tại', {
            extensions: {
                code: Chat_ERROR_CODE.UserNotFound,
            },
        });
    }
}
export class TaskNotAllowUpdateError extends GraphQLError {
    constructor(message: string | null = null) {
        super(
            message || 'TaskNotAllowUpdateError',{
                extensions: {
                    code: Chat_ERROR_CODE.TaskNotAllowUpdate,
                },
            }
        );
    }
}
export class UserAlreadyExistError extends GraphQLError {
    constructor(message: string | null = null) {
        super(
            message ||
                'Người dùng có email, tài khoản đã tồn tại. Hãy đăng nhập hoặc chọn email, tài khoản khác',
            {
                extensions: {
                    code: Chat_ERROR_CODE.UserAlreadyExist,
                },
            }
        );
    }
}

export class InValidRoleError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Không xác định được quyền truy cập của người dùng', {
            extensions: {
                code: Chat_ERROR_CODE.InValidRole,
            },
        });
    }
}

export class MySQLError extends GraphQLError {
    constructor(message: string | null = null) {
        super(message || 'Lỗi bất thường khi thao tác trong cơ sở dữ liệu', {
            extensions: {
                code: Chat_ERROR_CODE.MySQL,
            },
        });
    }
}
