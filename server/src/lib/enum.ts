export enum DefaultHashValue {
    saltRounds = 10,
}

export enum roleID {
    ADMIN = 0,
    CANDIDATE = 1,
    EMPLOYER = 2,
}

export enum status_job {
    pending = 0,
    approved = 1,
    closed = 2,
    rejected = 3,
}

export enum status_application {
    pending = 0,
    interview = 1,
    rejected = 2,
}

export enum type_job {
    full_time = 0,
    part_time = 1,
    contract = 2,
    intern = 3,
    freelance = 4,
    temporary= 5,
    remote= 6,
}

export enum degree {
    intern = 0, // thuc tập
    staff = 1, // nhân viên
    group_leader = 2, // trưởng nhóm
    manage = 3, // quản lý
    supervisory = 4, // giám sát
    senior_position= 5, // vị trí cấp cao
}