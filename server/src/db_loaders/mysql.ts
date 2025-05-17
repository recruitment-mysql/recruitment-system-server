/* eslint-disable import/extensions,@typescript-eslint/no-unused-vars */
import { Sequelize } from 'sequelize';
import { database } from '../config/appConfig';
import { initModels } from '../db_models/sql/init-models';
import users from '../test_data/sql/users.json';
import skills from '../test_data/sql/skills.json';
import industries from '../test_data/sql/industries.json';
import job_categories  from '../test_data/sql/job_categories.json';
import applications from '../test_data/sql/applications.json';



export const sequelize = new Sequelize(
    database.MYSQL.db_name,
    database.MYSQL.db_user,
    database.MYSQL.db_password,
    {
        ...database.MYSQL.option,
    }
);

const models = initModels(sequelize);

export const syncDatabase = async (): Promise<Sequelize> => {
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
                    await models.skills.bulkCreate(skills as any);
                    await models.applications.bulkCreate(applications as any);
                    await models.industries.bulkCreate(industries as any);
                    await models.job_categories.bulkCreate(job_categories as any);

                }
            })
            .catch((err) => {
                console.error(err);
            });
    }
    return sequelize;
};

export * as db from '../db_models/sql/init-models';