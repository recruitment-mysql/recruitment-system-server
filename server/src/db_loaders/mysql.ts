/* eslint-disable import/extensions,@typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize';
import { database } from '../config/appConfig';
import { initModels } from '../db_models/init-models';
import users from '../test_data/users.json';

export const sequelize = new Sequelize(
    database.MYSQL.db_name,
    database.MYSQL.db_user,
    database.MYSQL.db_password,
    {
        ...database.MYSQL.option,
    }
);

const models = initModels(sequelize);

export const syncDatabase = async () => {
    console.log('process.env.SYNC_DATA: ', process.env.SYNC_DATA);
    if (
        process.env.NODE_ENV === 'development' &&
        process.env.SYNC_DATA === 'true'
    ) {
        const isForceSync = process.env.SYNC_DATA === 'true';
        await sequelize
            .sync({ force: isForceSync, alter: true })
            .then(() => {
                console.log('Database sync is done!');
            })
            .then(async () => {
                if (isForceSync) {
                    await models.users.bulkCreate(users as any);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
};

export * as db from '../db_models/init-models';
