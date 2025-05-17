import type { Sequelize } from 'sequelize';
import { applications as _applications } from './applications';
import type { applicationsAttributes, applicationsCreationAttributes } from './applications';
import { industries as _industries } from './industries';
import type { industriesAttributes, industriesCreationAttributes } from './industries';
import { job_categories as _job_categories } from './job_categories';
import type { job_categoriesAttributes, job_categoriesCreationAttributes } from './job_categories';
import { skills as _skills } from './skills';
import type { skillsAttributes, skillsCreationAttributes } from './skills';
import { users as _users } from './users';
import type { usersAttributes, usersCreationAttributes } from './users';

export {
  _applications as applications,
  _industries as industries,
  _job_categories as job_categories,
  _skills as skills,
  _users as users,
};

export type {
  applicationsAttributes,
  applicationsCreationAttributes,
  industriesAttributes,
  industriesCreationAttributes,
  job_categoriesAttributes,
  job_categoriesCreationAttributes,
  skillsAttributes,
  skillsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const applications = _applications.initModel(sequelize);
  const industries = _industries.initModel(sequelize);
  const job_categories = _job_categories.initModel(sequelize);
  const skills = _skills.initModel(sequelize);
  const users = _users.initModel(sequelize);


  return {
    applications,
    industries,
    job_categories,
    skills,
    users,
  };
}
