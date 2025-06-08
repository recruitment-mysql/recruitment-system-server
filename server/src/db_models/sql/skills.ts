import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface skillsAttributes {
  skill_id: number;
  name: string;
}

export type skillsPk = 'skill_id';
export type skillsId = skills[skillsPk];
export type skillsOptionalAttributes = 'skill_id';
export type skillsCreationAttributes = Optional<skillsAttributes, skillsOptionalAttributes>;

export class skills extends Model<skillsAttributes, skillsCreationAttributes> implements skillsAttributes {
  skill_id!: number;

  name!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof skills {
    return skills.init({
    skill_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'skills',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'skill_id' },
        ]
      },
    ]
  });
  }
}
