import * as Sequelize from 'sequelize';
import {DataTypes, Model, Optional} from 'sequelize';

export interface usersAttributes {
    user_id: number;
    email: string;
    password_hash: string;
    number_phone: string;
    full_name: string;
    role: number;
    status: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export type usersPk = 'user_id';
export type usersId = users[usersPk];
export type usersOptionalAttributes = 'user_id' | 'created_at' | 'updated_at';
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
    user_id!: number;

    email!: string;

    password_hash!: string;

    number_phone! : string ;

    full_name!: string;

    role!: number;

    status!: boolean;

    created_at?: Date;

    updated_at?: Date;


    static initModel(sequelize: Sequelize.Sequelize): typeof users {
        return users.init({
            user_id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: 'email'
            },
            password_hash: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            number_phone: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            full_name: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            role: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false
            }
        }, {
            sequelize,
            tableName: 'users',
            timestamps: true,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    using: 'BTREE',
                    fields: [
                        {name: 'user_id'},
                    ]
                },
                {
                    name: 'email',
                    unique: true,
                    using: 'BTREE',
                    fields: [
                        {name: 'email'},
                    ]
                },
            ]
        });
    }
}
