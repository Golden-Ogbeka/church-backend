import { DataTypes, Sequelize } from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export const DepartmentModel = sequelizeInstance.define(
  'department',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  },
  {
    tableName: 'tbl_dept', // to be changed to departments
  }
);

// DepartmentModel.hasMany(UserModel, {
//   foreignKey: 'dept',
// });
