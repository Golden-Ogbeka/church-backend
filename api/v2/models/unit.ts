import { DataTypes, Sequelize } from 'sequelize';
import { sequelizeInstance } from '../../../config/db';
import { DepartmentModel } from './department';

export const UnitModel = sequelizeInstance.define(
  'unit',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dept_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    u_names: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
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
    tableName: 'tbl_unit', // to be changed to units
  }
);

UnitModel.belongsTo(DepartmentModel, {
  foreignKey: 'dept_id',
});
