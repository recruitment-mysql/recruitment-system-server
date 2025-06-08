import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface applicationsAttributes {
  application_id: number;
  job_id: string;
  candidate_id: number;
  status: number;
  applied_at?: Date;
}

export type applicationsPk = 'application_id';
export type applicationsId = applications[applicationsPk];
export type applicationsOptionalAttributes = 'application_id'|'status' | 'applied_at';
export type applicationsCreationAttributes = Optional<applicationsAttributes, applicationsOptionalAttributes>;

export class applications extends Model<applicationsAttributes, applicationsCreationAttributes> implements applicationsAttributes {
  application_id!: number;

  job_id!: string;

  candidate_id!: number;

  status!: number;

  applied_at?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof applications {
    return applications.init({
    application_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    job_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    candidate_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    applied_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'applications',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'application_id' },
        ]
      },
    ]
  });
  }
}
