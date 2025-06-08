import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface job_categoriesAttributes {
  category_id: number;
  name: string;
}

export type job_categoriesPk = 'category_id';
export type job_categoriesId = job_categories[job_categoriesPk];
export type job_categoriesOptionalAttributes = 'category_id';
export type job_categoriesCreationAttributes = Optional<job_categoriesAttributes, job_categoriesOptionalAttributes>;

export class job_categories extends Model<job_categoriesAttributes, job_categoriesCreationAttributes> implements job_categoriesAttributes {
  category_id!: number;

  name!: string;

  group_id!: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof job_categories {
    return job_categories.init({
    category_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'job_categories',
    timestamps: false,
    indexes: [
      {
        name: 'PRIMARY',
        unique: true,
        using: 'BTREE',
        fields: [
          { name: 'category_id' },
        ]
      },
    ]
  });
  }
}
