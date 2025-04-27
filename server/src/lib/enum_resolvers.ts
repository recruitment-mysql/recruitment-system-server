import { roleID ,type_user,type_collection,type_status_collection } from './enum';
import { InValidRoleError,InValidRoleErrorTypeUser,InValidTypeErrorTypeCollection,InValidTypeErrorTypeStatusCollection
} from './classes/graphqlErrors';

export const iRoleToNumber = (role: number) => {
    switch (role) {
        case 0:
            return roleID.ADMIN;
        case 1:
            return roleID.CONTENT_MANAGEMENT;
        case 2:
            return roleID.STUDENTS;
        default:
            throw new InValidRoleError();
    }
};
export const typeUserToNumber = (UserToNumber: number) => {
    switch (UserToNumber) {
        case 0:
            return type_user.PROFESSOR;
        case 1:
            return type_user.STUDENTS;
        default:
            throw new InValidRoleErrorTypeUser();
    }
};
export const typeCollectionToNumber = (StatusToNumber: number) => {
    switch (StatusToNumber) {
        case 0:
            return type_collection.RESEARCH;
        case 1:
            return type_collection.PUBLICATION;
        case 2:
            return type_collection.FACILITY;
        case 3:
            return type_collection.NEWS;
        case 4:
            return type_collection.DRIVER;
        default:
            throw new InValidTypeErrorTypeCollection();
    }
};
export const typeStatusCollectionToNumber = (TypeCollectionToNumber: number) => {
    switch (TypeCollectionToNumber) {
        case 0:
            return type_status_collection.WAITING_FOR_APPROVAL;
        case 1:
            return type_status_collection.APPROVED;
        case 2:
            return type_status_collection.HIDDEN;
        default:
            throw new InValidTypeErrorTypeStatusCollection();
    }
};