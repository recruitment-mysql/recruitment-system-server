import type { Model } from 'mongoose';
import Candidate from './candidate';
import type { ICandidate } from './candidate';
import Employer from './employer';
import type { IEmployer } from './employer';
import Job from './job';
import type { IJob } from './job';
import Follow from './follow';
import type { IFollow } from './follow';

export {
    Candidate as candidate,
    Employer as employer,
    Job as job,
    Follow as follow,
};

export type {
    ICandidate,
    IEmployer,
    IJob,
    IFollow
};

// 👉 define type của return object
export interface NoSQLModels {
    candidate: Model<ICandidate>;
    employer: Model<IEmployer>;
    job: Model<IJob>;
    follow: Model<IFollow>;
}

export function initModels(): NoSQLModels {
    return {
        candidate: Candidate,
        employer: Employer,
        job: Job,
        follow: Follow,
    };
}
