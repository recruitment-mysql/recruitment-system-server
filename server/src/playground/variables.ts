const email = 'admin@gmail.com';
const password = '123456';
const userForLogin = 'userdemo@gmail.com';
const passwordForLogin = '123456';

export const variables = {
    login: {
        input: {
            email,
            password,
        },
    },
    register: {
        input: {
            email: userForLogin,
            password: passwordForLogin,
            full_name: 'demo',
            role: 1,
        },
    },
    forgot_password: {
        input: {
            email: 'dn4810303@gmail.com'
        },
    },
    change_password: {
        input: {
            password_old: password,
            password_new: '111111'
        },
    },
    getUserProfile: {
        user_id: 2,
    },
    update_profile: {
        input: {
            name: 'update profile',
            avatar: '',
            number_phone: '034203013006'
        }

    },

    // query candidate
    getFeaturedJobs: {
        input: {
            limit: 10,
            page: 1
        }
    },
    getFeaturedEmployers: {
        input: {
            limit: 10,
            page: 1
        }

    },
    getJobDetail: {
        jobId: 'job001',
    },
    searchJobs: {
        input: {
            degree: ' ',
            date: 5,
            job_categories: 2,
            Salary_min: 1000,
            Salary_Max: 5000,
            job_type: 'full-time',
            limit: 10,
            page: 1
        }
    },
    searchEmployers: {
        input: {
            name_Employer: 'emp001',
            city_address: 'Hanoi',
            industries: 'Accounting',
            limit: 10,
            page: 1
        }
    },
    getAppliedJobs: {
        input: {
            limit: 10,
            page: 1
        }

    },
    getSavedJobs: {
        input: {
            limit: 10,
            page: 1
        }

    },
    getSavedEmployer: {
        input: {
            limit: 10,
            page: 1
        }

    },


    // mutation candidate
    upsertCandidate: {
        input: {
            name: 'Dy',
            avatar: ' ',
            file_cv: '',
            status: true,
            job_selection_criteria: {
                salary: 1000,
                city_address: 'Hanoi',
                degree: '',
                job_categories: [1, 2]
            },
        }
    },
    toggleFollowJob: {
        input: {
            job_id: 'job_003',
            action: true
        }

    },
    toggleFollowEmployer: {
        input: {
            employer_id: 1,
            action: true
        }

    },
    apply_job: {
        jobId: 'job001',
    },

    // query employer
    listJobByEmployer: {
        input: {
            limit: 10,
            page: 1,
            status: 1
        }

    },
    listApplicantsByJob: {
        jobId: 'job001',
    },
    findCandidateByEmail: {
        email : 'dn4810303@gmail.com'
    },


    // mutation employer
    updateEmployerProfile: {
        input: {
            headquarters: {
                city_address: 'Thai Binh',
                specific_address: 'Thai Thuy'
            },
            industry_id: 2,
            description: '    ',
            social_links_Website: '',
            social_links_Facebook: '',
            social_links_Youtube: '',
            number_of_employees: 50
        }

    },
    createJob: {
        input: {
            title: 'title day la test',
            description: 'description test',
            skills_required: [1, 2],
            job_categories: [2, 3],
            degree: '',
            experience_years_required: 6,
            quantity: 3,
            foreign_language: 'Tieng Anh',
            Salary: 1000,
            job_type: 2,
            branches: [1, 2]
        }

    },
    updateJob: {
        input: {
            jobId: 'job001',
            title: 'demo title update',
            description: 'description test update',
            skills_required: [1, 2],
            job_categories: [1, 2],
            degree: '',
            experience_years_required: 2,
            quantity: 2,
            foreign_language: 'Tieng Anh',
            Salary: 50,
            job_type: 1,
            branches: [1, 2]
        },
        updateApplicantStatus: {
            input: {
                jobId: 'job001',
                candidateId: 2,
                status: 2
            }

        },
        deleteJob: {
            jobId: 'job001',
        },


    },
    updateApplicantStatus: {
        input: {
            jobId: 'job001',
            candidateId: 2,
            status: 2
        }

    },
    deleteJob: {
     jobId: 'job001',
    },

    listUsers: {
        input: {
            role: 1,
            limit:10,
            page:1
        }

    },
    findUserByEmail: {
        email : 'dn4810303@gmail.com'
    },
    pendingJobs: {
        input: {
            limit: 10,
            page: 1,
        }

    },
    pendingEmployers: {
        input: {
            limit: 10,
            page: 1,
        }

    },
    getMasterData: {
        type: 'SKILL'
    },

    deleteUser: {
        user_id: 2,
    },
    updateJobStatus: {
        jobId: 'job_001',
        status: 2
    },
    updateEmployerStatus: {
        employer_id: 2,
        status: 2
    },
    createMasterData: {
        type: 'SKILL',
        name: 'test'

    },
    updateMasterData: {
        id: 'job001',
        input : {
            type: 'SKILL',
            name: 'test updateMasterData'
        }

    },


};
