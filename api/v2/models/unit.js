const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');
const { DepartmentModel } = require('./department');

const UnitModel = sequelizeInstance.define(
  'unit',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
      defaultValue: 0,
    },
    dept_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    u_names: {
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
    tableName: 'tbl_unit', // to be changed to units
  }
);

UnitModel.belongsTo(DepartmentModel, {
  foreignKey: 'dept_id',
  constraints: false,
});

module.exports = { UnitModel };
