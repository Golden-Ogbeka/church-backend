const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');

const VisitorModel = sequelizeInstance.define(
  'visitor',
  {
    id: {
      autoIncrement: false,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    fname: {
      type: DataTypes.STRING,
    },
    lname: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    nearest: {
      type: DataTypes.STRING,
    },
    marital: {
      type: DataTypes.STRING,
      values: ['Married', 'Single', 'Widowed', 'Divorced', 'Engaged'],
    },
    gender: {
      type: DataTypes.STRING,
      values: ['Male', 'Female'],
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    contact_mode: {
      type: DataTypes.STRING,
    },
    service_opinion: {
      type: DataTypes.STRING,
      values: ['Poor', 'Fair', 'Good', 'Excellent'],
    },
    suggestions: {
      type: DataTypes.STRING,
    },
    membership: {
      type: DataTypes.STRING,
    },
    dated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    assigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timer2: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    timer21: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'visitor',
    paranoid: true,
  }
);

module.exports = { VisitorModel };
