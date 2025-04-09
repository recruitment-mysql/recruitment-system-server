/* eslint-disable linebreak-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable linebreak-style */

import bcrypt from 'bcrypt';
import { Transaction } from 'sequelize';
import { db } from '../../db_loaders/mysql';
import { checkAuthentication } from '../../lib/ultis/permision';
import { IResolvers, ISuccessResponse } from '../../__generated__/graphql';
import { MySQLError } from '../../lib/classes/graphqlErrors';

const userResolver: IResolvers = {
    Query: {
        // eslint-disable-next-line no-empty-pattern
        users: async (_parent, {}, context) => {
            checkAuthentication(context);
            return await db.users.findAll().catch((error) => {
                throw new MySQLError(`Error: ${error.message}`);
            });
        },
    },
};
export default userResolver;
