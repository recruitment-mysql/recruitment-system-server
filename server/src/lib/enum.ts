import fs from 'fs';

export enum DefaultHashValue {
    saltRounds = 10,
}

export enum roleID {
    ADMIN = 0,
    CONTENT_MANAGEMENT = 1,
    STUDENTS = 2,

}
export const deleteImage = (filePath: string): Promise<void> => new Promise((resolve, reject) => {
    fs.unlink(filePath, (error) => {
        if (error) {
            reject(error);
            return;
        }
        resolve();
    });
});
// export enum Host {
//     urlAvatar = 'http://localhost:4003/api/image/avatar/',
//     urlCollection = 'http://localhost:4003/api/image/collection/',
//     urlAvatarDelete = '/app/src/schema/resolvers/uploads/avatar/',
//     urlCollectionDelete = '/app/src/schema/resolvers/uploads/collection/',
//
// }
export enum type_user {
    PROFESSOR = 0,
    STUDENTS = 1,
}
export enum type_collection {
    RESEARCH = 0,
    PUBLICATION = 1,
    FACILITY = 2,
    NEWS = 3,
    DRIVER = 4
}
export enum type_status_collection {
    WAITING_FOR_APPROVAL = 0,
    APPROVED = 1,
    HIDDEN = 2,
}