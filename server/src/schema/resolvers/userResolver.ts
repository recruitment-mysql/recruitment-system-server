/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */

import bcrypt from 'bcrypt';
import {Transaction} from 'sequelize';
import fs from 'fs';
import path from 'path';
import * as crypto from 'crypto';
import {db, sequelize} from '../../db_loaders/mysql';
import {checkAuthentication} from '../../lib/ultis/permision';
import {IResolvers, ISuccessResponse} from '../../__generated__/graphql';
import {MySQLError, UserAlreadyExistError, UserNotFoundError} from '../../lib/classes/graphqlErrors';
import {generateJWT} from '../../lib/ultis/jwt';
import {DefaultHashValue} from '../../lib/enum';
import {usersCreationAttributes} from '../../db_models/sql/users';
import {iRoleToNumber} from '../../lib/enum_resolvers';
import {sendEmail} from '../../lib/sendEmail';


const userResolver: IResolvers = {
    Query: {
        // eslint-disable-next-line no-empty-pattern
        users: async (_parent, {}, context) => {
            checkAuthentication(context);
            const { user } = context;
            if (user?.id) {
                return await db.users.findByPk(user.id, {
                    rejectOnEmpty: new UserNotFoundError('Người dùng không tồn tại'),
                });
            }
            throw new UserNotFoundError('Người dùng không tồn tại');
        },
        login: async (_parent, { input }) => {
            const { email, password } = input;
            const user = await db.users.findOne({
                where: {
                    email,
                },
                rejectOnEmpty: new UserNotFoundError(
                    'Người dùng không tồn tại'
                ),
            });
            const checkPassword = bcrypt.compareSync(password, user.password_hash);
            if (!checkPassword) {
                throw new UserNotFoundError('Sai mật khẩu!!!');
            }
            const token = generateJWT( user.email, user.user_id,user.role);
            return {
                token,
                user,
            };
        },
    },
    Mutation :{
        register: async (_parent, { input }) => {
            const {
                email,
                password,
                role,
                full_name,
                avarta,
            } = input;

            if (!email || !password) {
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
                role: iRoleToNumber(role),
            };
            return await sequelize.transaction(async (t: Transaction) => {
                try {
                    const newUser = await db.users.create(userAttribute, {
                        transaction: t,
                    });
                    if (avarta) {
                        const { createReadStream, filename } = await avarta.file ;
                        const uploadDir = path.join(__dirname, 'uploads/avatar');
                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir);
                        }
                        const filePath = path.join(uploadDir, `avatar_${newUser.user_id}.png`);
                        const writeStream = fs.createWriteStream(filePath);
                        await new Promise((resolve, reject) => {
                            createReadStream()
                                .pipe(writeStream)
                                .on('finish', resolve)
                                .on('error', reject);
                        });
                        newUser.avarta = `${ process.env.urlAvatar}avatar_${newUser.user_id}.png`;
                        await newUser.save({ transaction: t });
                    }
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
        forgot_password: async (_parent,{input}) => {
            const transaction = await sequelize.transaction();
            try {
                    const { email } = input;
                    const user_forgot_password = await db.users.findOne({
                        where: { email },
                        transaction,
                    });
                    if (!user_forgot_password) {
                        throw new Error('Người dùng không tồn tại.');
                    }
                    const newPassword = crypto.randomBytes(4).toString('hex');
                    const salt = bcrypt.genSaltSync(DefaultHashValue.saltRounds);
                    user_forgot_password.password_hash = bcrypt.hashSync(newPassword, salt);
                    await user_forgot_password.save({ transaction });

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
        change_password: async (_parent, { input }, context) => {
            const { user } = context;
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
                    await CheckUserUpdate.save({ transaction: t });
                } catch (error) {
                    await t.rollback();
                    throw new MySQLError('Update User Fail');
                }
            });
            return ISuccessResponse.Success;
        },
    },
};
export default userResolver;
