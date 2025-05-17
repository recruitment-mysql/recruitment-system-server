/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */

import bcrypt from 'bcrypt';
import {Transaction} from 'sequelize';
import fs from 'fs';
import path from 'path';
import * as crypto from 'crypto';
import {Readable} from 'stream';
import {models} from '../../db_loaders/mongodb';
import {db, sequelize} from '../../db_loaders/mysql';
import {checkAuthentication} from '../../lib/ultis/permision';
import {IResolvers, ISuccessResponse} from '../../__generated__/graphql';
import {
    AuthenticationError,
    MySQLError,
    UserAlreadyExistError,
    UserNotFoundError
} from '../../lib/classes/graphqlErrors';
import {generateJWT} from '../../lib/ultis/jwt';
import {DefaultHashValue, roleID} from '../../lib/enum';
import { formatCandidate, formatEmployer, iRoleToNumber, streamToBuffer } from '../../lib/enum_resolvers';
import {usersCreationAttributes} from '../../db_models/sql/users';
import {sendEmail} from '../../lib/sendEmail';
import {skillsAttributes} from '../../db_models/sql/skills';
import {industriesAttributes} from '../../db_models/sql/industries';
import {Ibranchs, Iheadquarters} from '../../db_models/no_sql/employer';
import {app} from '../../config/appConfig';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fromBuffer } = require('file-type');

const userResolver: IResolvers = {
    Query: {
        getUserProfile: async (_parent, {user_id}, context) => {
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

            const requesterId = context.user?.id ?? null;
            const requesterRole = context.user?.role ?? null;

            const isSelf = requesterId === user_id;
            const isGuest = !requesterId;
            const isRequesterEmployer = requesterRole === roleID.EMPLOYER;
            const isRequesterCandidate = requesterRole === roleID.CANDIDATE;


            const user = await db.users.findByPk(user_id);
            if (!user) throw new UserNotFoundError();


            const candidate = await models.candidate.findOne({user_id}).lean();
            const employer = await models.employer.findOne({user_id}).lean();

            if (user.role === roleID.ADMIN && !isSelf) {
                throw new AuthenticationError(' chỉ Admin được xem hồ sơ của họ');
            }
            if (isGuest && candidate) {
                throw new AuthenticationError('Khách không được xem hồ sơ ứng viên');
            }
            if (!isSelf && requesterRole !== roleID.ADMIN && candidate && !isRequesterEmployer) {
                throw new AuthenticationError(' không được xem hồ sơ ứng viên khác');
            }
            if (!isSelf && requesterRole !== roleID.ADMIN && employer && !isRequesterCandidate && requesterId) {
                throw new AuthenticationError(' không được xem hồ sơ nhà tuyển dụng khác');
            }


            let filteredCandidate: IFilteredCandidate | null = null;
            if (candidate) {
                filteredCandidate = await formatCandidate(candidate, {
                    isSelf,
                    requesterRole,
                    isRequesterEmployer,
                });
            }
            let filteredEmployer: IEmployer | null = null;
            if (employer) {
                filteredEmployer = await formatEmployer(employer, {
                    isSelf,
                    requesterRole,
                });
            }
            if (!isSelf && requesterRole !== roleID.ADMIN) {
                user.email = '';
                user.number_phone = '';
            }
            const users = user.toJSON() as any;
            const check_avatar = await models.avatar
                .findOne({ user_id })
                .lean();
            users.avatar = check_avatar
                ? `http://${app.host}:${app.port}/avatar/${user_id}`
                : null;
            return {
                user : users,
                candidateProfile: filteredCandidate,
                employerProfile: filteredEmployer,
            };
        },
        login: async (_parent, {input}) => {
            const {email, password} = input;
            const user = await db.users.findOne({
                where: {
                    email,
                },
                rejectOnEmpty: new UserNotFoundError(
                    'Người dùng không tồn tại'
                ),
            });
            if(!user.status) throw new AuthenticationError('tai khoan da bi khoa');
            const checkPassword = bcrypt.compareSync(password, user.password_hash);
            if (!checkPassword) {
                throw new UserNotFoundError('Sai mật khẩu!!!');
            }
            const token = generateJWT(user.email, user.user_id, user.role);
            return {
                token,
                user,
            };
        },
    },
    Mutation: {
        registerAdmin: async (_parent, {input} , context) => {
            checkAuthentication(context);
            const {user}=context;
            if(user.role !== roleID.ADMIN) throw new AuthenticationError('bạn không phải admin');
            const { email, password, full_name, number_phone, avatar } =
                input;
            if (!email.trim() || !password.trim()) {
                throw new Error('Email và mật khẩu không được để trống.');
            }
            const createdUser = await db.users.findOne({
                where: {
                    email,
                },
                rejectOnEmpty: false,
            });
            if (createdUser) {
                throw new UserAlreadyExistError('user đã tồn tại ');
            }

            const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const userAttribute: usersCreationAttributes = {
                email,
                password_hash: hashedPassword,
                full_name,
                number_phone,
                role: 0,
                status : true
            };
            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const newUser = await db.users.create(userAttribute, {
                        transaction: t,
                    });
                    if (avatar) {
                        const {createReadStream, filename, mimetype} = await avatar;
                        const stream = createReadStream();

                        const buffer = await streamToBuffer(stream);
                        await models.avatar.create({
                            user_id: newUser.user_id,
                            filename,
                            contentType: mimetype,
                            size: buffer.length,
                            data: buffer
                        });

                    }
                    await newUser.save({transaction: t});
                    return newUser;
                } catch (error) {
                    await t.rollback();
                    console.log(error);
                    throw new MySQLError(
                        `Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`
                    );
                }
            });
        },
        register: async (_parent, {input}) => {
            const { email, password, role, full_name, number_phone, avatar } =
                input;
            if (role === roleID.ADMIN) {
                    throw new AuthenticationError('Chỉ admin mới được phép tạo tài khoản admin.');
            }
            if (!email.trim() || !password.trim()) {
                throw new Error('Email và mật khẩu không được để trống.');
            }
            const createdUser = await db.users.findOne({
                where: {
                    email,
                },
                rejectOnEmpty: false,
            });
            if (createdUser) {
                throw new UserAlreadyExistError('user đã tồn tại ');
            }

            const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            const userAttribute: usersCreationAttributes = {
                email,
                password_hash: hashedPassword,
                full_name,
                number_phone,
                role: iRoleToNumber(role),
                status : true
            };
            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const newUser = await db.users.create(userAttribute, {
                        transaction: t,
                    });
                    if (avatar) {
                        const {createReadStream, filename, mimetype} = await avatar;
                        const stream = createReadStream();

                        const buffer = await streamToBuffer(stream);
                        await models.avatar.create({
                            user_id: newUser.user_id,
                            filename,
                            contentType: mimetype,
                            size: buffer.length,
                            data: buffer
                        });

                    }
                    if (newUser.role === roleID.EMPLOYER) {
                        await models.employer.create({
                            employer_id: newUser.user_id,
                            user_id: newUser.user_id,
                            name_employer: newUser.full_name,
                            status: false,
                        });
                    }
                    if (newUser.role === roleID.CANDIDATE) {
                        await models.candidate.create({
                            candidate_id: newUser.user_id,
                            user_id: newUser.user_id,
                            status: true,
                        });
                    }
                    await newUser.save({transaction: t});
                    return newUser;
                } catch (error) {
                    await t.rollback();
                    console.log(error);
                    throw new MySQLError(
                        `Lỗi bất thường khi thao tác trong cơ sở dữ liệu: ${error}`
                    );
                }
            });
        },
        // eslint-disable-next-line no-empty-pattern
        forgot_password: async (_parent, {input}) => {
            const transaction = await sequelize.transaction();
            try {
                const {email} = input;
                const user_forgot_password = await db.users.findOne({
                    where: {email},
                    transaction,
                });
                if (!user_forgot_password) {
                    throw new Error('Người dùng không tồn tại.');
                }
                const newPassword = crypto.randomBytes(4).toString('hex');
                const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
                user_forgot_password.password_hash = bcrypt.hashSync(newPassword, salt);
                await user_forgot_password.save({transaction});

                const emailContent = `
        <h3>Xin chào ${user_forgot_password.full_name},</h3>
        <p>Mật khẩu mới của bạn là: <strong>${newPassword}</strong></p>
        <p>Vui lòng đăng nhập và thay đổi mật khẩu ngay khi có thể.</p>
    `;

                await sendEmail(user_forgot_password.email, 'Mật khẩu mới của bạn', emailContent);
                await transaction.commit();
                return ISuccessResponse.Success;
            } catch (error) {
                await transaction.rollback();
                console.error('Lỗi trong quá trình quên mật khẩu:', error);
                throw new Error('Không thể hoàn tất việc quên mật khẩu. Vui lòng thử lại.');
            }
        },
        change_password: async (_parent, {input}, context) => {
            const {user} = context;
            checkAuthentication(context);
            const {
                password_old,
                password_new
            } = input;
            const CheckUserUpdate = await db.users.findByPk(user.id, {
                rejectOnEmpty: new UserNotFoundError('Người dùng không tồn tại!'),
            });
            const checkPassword = bcrypt.compareSync(password_old, CheckUserUpdate.password_hash);
            if (!checkPassword) {
                throw new UserNotFoundError('Sai mật khẩu cũ !!!');
            }
            const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
            CheckUserUpdate.password_hash = bcrypt.hashSync(password_new, salt);
            await sequelize.transaction(async (t: Transaction) => {
                try {
                    await CheckUserUpdate.save({transaction: t});
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError('Update User Fail');
                }
            });
            return ISuccessResponse.Success;
        },
        update_profile: async (_parent, {input}, context) => {
            const {user} = context;
            checkAuthentication(context);
            const {
                name,
                avatar,
                number_phone
            } = input;
            const check_user = await db.users.findByPk(user.id);
            if (!check_user) {
                throw new Error('nguoi dung khong ton tai');
            }
            check_user.full_name = name?.trim() ? name : check_user.full_name;
            check_user.number_phone = number_phone?.trim() ? number_phone : check_user.number_phone;
            console.log('day la avatar', avatar);
            if (avatar) {
                const {createReadStream, filename, mimetype} = await avatar.promise;
                const stream = createReadStream();
                const buffer = await streamToBuffer(stream);
                const type = await fromBuffer(buffer);
                console.log('day la type cua user',type);
                const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

                if (!type || !allowed.includes(type.mime)) {
                    throw new Error('File không phải là ảnh hợp lệ');
                }
                await models.avatar.deleteMany({candidate_id: user.id});
                await models.avatar.create({
                    user_id: user.id,
                    filename,
                    contentType: mimetype,
                    size: buffer.length,
                    data: buffer
                });
                console.log('da update avarta');
            }
            await check_user.save();
            return ISuccessResponse.Success;
        },
    },
};
export default userResolver;
