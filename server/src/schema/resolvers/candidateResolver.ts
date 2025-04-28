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

