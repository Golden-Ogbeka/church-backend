const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');

const AdminModel = sequelizeInstance.define(
  'admin',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
      values: ['admin', 'superAdmin'],
    },
    // Password Controls
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verificationCode: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: true,
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
    paranoid: true, //for soft delete
    defaultScope: {
      attributes: { exclude: ['password', 'verificationCode'] },
    },
  }
);

module.exports = { AdminModel };
