const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');

const DepartmentModel = sequelizeInstance.define(
  'department',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
      defaultValue: 0,
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

module.exports = { DepartmentModel };
