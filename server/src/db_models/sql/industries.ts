import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface industriesAttributes {
  industry_id: number;
  name: string;
}

export type industriesPk = 'industry_id';
export type industriesId = industries[industriesPk];
export type industriesOptionalAttributes = 'industry_id';
export type industriesCreationAttributes = Optional<industriesAttributes, industriesOptionalAttributes>;

export class industries extends Model<industriesAttributes, industriesCreationAttributes> implements industriesAttributes {
  industry_id!: number;

  name!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof industries {
    return industries.init({
    industry_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'industries',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'industry_id' },
        ]
      },
    ]
  });
  }
}
