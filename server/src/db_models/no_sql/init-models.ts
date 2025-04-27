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

export function initModels() {
    const candidate = Candidate;
    const employer = Employer;
    const job = Job;
    const follow = Follow;

    return {
        candidate,
        employer,
        job,
        follow
    };
}