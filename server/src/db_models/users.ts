import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface usersAttributes {
  id: number;
  userName: string;
  passWord: string;
  firstName?: string;
  lastName?: string;
  role: number;
  phoneNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type usersPk = 'id';
export type usersId = users[usersPk];
export type usersOptionalAttributes = 'id' | 'firstName' | 'lastName' | 'phoneNumber' | 'createdAt' | 'updatedAt';
export type usersCreationAttributes = Optional<usersAttributes, usersOptionalAttributes>;

export class users extends Model<usersAttributes, usersCreationAttributes> implements usersAttributes {
  id!: number;

  userName!: string;

  passWord!: string;

  firstName?: string;

  lastName?: string;

  role!: number;

  phoneNumber?: string;

  createdAt?: string;

  updatedAt?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof users {
    return users.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    passWord: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    role: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    phoneNumber: {
      type: DataTypes.STRING(10),
      allowNull: true
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
          { name: 'id' },
        ]
      },
      {
        name: 'id_UNIQUE',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'id' },
        ]
      },
    ]
  });
  }
}
