import type { Model } from 'mongoose';
import Candidate from './candidate';
import type { ICandidate } from './candidate';
import Employer from './employer';
import type { IEmployer } from './employer';
import Job from './job';
import type { IJob } from './job';
import Follow_employer from './follow_employer';
import type { IFollow_employer } from './follow_employer';
import Follow_job from './follow_job';
import type { IFollow_job } from './follow_job';
import CvFile from './CvFile';
import type { ICvFile } from './CvFile';
import Avatar from './avarta';
import type { IAvatar } from './avarta';

export {
    Candidate as candidate,
    Employer as employer,
    Job as job,
    Follow_job as follow_job,
    Follow_employer as follow_employer,
    CvFile as cvFile,
    Avatar as avatar,
};

export type {
    ICandidate,
    IEmployer,
    IJob,
    IFollow_employer,
    IFollow_job,
    IAvatar,
    ICvFile
};

// 👉 define type của return object
export interface NoSQLModels {
    candidate: Model<ICandidate>;
    employer: Model<IEmployer>;
    job: Model<IJob>;
    follow_job: Model<IFollow_job>;
    follow_employer: Model<IFollow_employer>;
    cvFile : Model<ICvFile>;
    avatar : Model<IAvatar>;
}

export function initModels(): NoSQLModels {
    return {
        candidate: Candidate,
        employer: Employer,
        job: Job,
        follow_job: Follow_job,
        follow_employer: Follow_employer,
        cvFile : CvFile,
        avatar : Avatar
    };
}
