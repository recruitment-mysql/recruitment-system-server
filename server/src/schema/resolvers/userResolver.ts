/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */

import bcrypt from 'bcrypt';
import {Transaction} from 'sequelize';
import fs from 'fs';
import path from 'path';
import {db, sequelize} from '../../db_loaders/mysql';
import { checkAuthentication } from '../../lib/ultis/permision';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import {
    AuthenticationError,
    MySQLError,
    UserAlreadyExistError,
    UserNotFoundError
} from '../../lib/classes/graphqlErrors';
import {generateJWT} from '../../lib/ultis/jwt';
import {DefaultHashValue, roleID} from '../../lib/enum';
import {usersCreationAttributes} from '../../db_models/sql/users';
import {iRoleToNumber} from '../../lib/enum_resolvers';


const userResolver: IResolvers = {
    Query: {
        // eslint-disable-next-line no-empty-pattern
        users: async (_parent, {}, context) => {
            checkAuthentication(context);
            return await db.users.findAll().catch((error) => {
                throw new MySQLError(`Error: ${error.message}`);
            });
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
    },
};
export default userResolver;
