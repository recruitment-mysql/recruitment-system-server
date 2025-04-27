import type { Sequelize } from 'sequelize';
import { applications as _applications } from './applications';
import type { applicationsAttributes, applicationsCreationAttributes } from './applications';
import { degrees as _degrees } from './degrees';
import type { degreesAttributes, degreesCreationAttributes } from './degrees';
import { industries as _industries } from './industries';
import type { industriesAttributes, industriesCreationAttributes } from './industries';
import { skills as _skills } from './skills';
import type { skillsAttributes, skillsCreationAttributes } from './skills';
import { users as _users } from './users';
import type { usersAttributes, usersCreationAttributes } from './users';

export {
  _applications as applications,
  _degrees as degrees,
  _industries as industries,
  _skills as skills,
  _users as users,
};

export type {
  applicationsAttributes,
  applicationsCreationAttributes,
  degreesAttributes,
  degreesCreationAttributes,
  industriesAttributes,
  industriesCreationAttributes,
  skillsAttributes,
  skillsCreationAttributes,
  usersAttributes,
  usersCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const applications = _applications.initModel(sequelize);
  const degrees = _degrees.initModel(sequelize);
  const industries = _industries.initModel(sequelize);
  const skills = _skills.initModel(sequelize);
  const users = _users.initModel(sequelize);


  return {
    applications,
    degrees,
    industries,
    skills,
    users,
  };
}
