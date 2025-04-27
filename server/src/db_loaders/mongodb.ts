/* eslint-disable import/extensions */
import mongoose from 'mongoose';
import { initModels } from '../db_models/no_sql/init-models';
import candidates from '../test_data/no_sql/candidates.json';
import employers from '../test_data/no_sql/employers.json';
import jobs from '../test_data/no_sql/jobs.json';

mongoose.set('strictQuery', true);

export const connectMongo = async (): Promise<typeof mongoose> => {
    try {
        const username = process.env.MONGO_USERNAME || 'admin';
        const password = process.env.MONGO_PASSWORD || 'recruitment';
        await mongoose.connect(`mongodb://${username}:${password}@mongodb:27017/recruitment_db?authSource=admin`);
        console.log('MongoDB Connected');

        if (process.env.NODE_ENV === 'development' && process.env.SYNC_DATA === 'true') {
            console.log('Starting MongoDB seeding...');
            const models = initModels();
            console.log('Deleting existing data...');
            await models.candidate.deleteMany({});
            await models.employer.deleteMany({});
            await models.job.deleteMany({});
            console.log('Inserting new data...');
            try {
                await models.candidate.insertMany(candidates);
                console.log('Candidates seeded');
                await models.employer.insertMany(employers);
                console.log('Employers seeded');
                await models.job.insertMany(jobs);
                console.log('Jobs seeded');
            } catch (insertError) {
                console.error('Seeding error:', insertError);
                throw insertError;
            }
            console.log('MongoDB seeded with test data');
        } else {
            console.log('Seeding skipped: NODE_ENV or SYNC_DATA not set correctly');
        }

        return mongoose;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export const models = initModels();
export * as db from '../db_models/no_sql/init-models';