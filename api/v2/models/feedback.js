const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');

const FeedbackModel = sequelizeInstance.define('feedback', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    values: ['read', 'unread'],
    defaultValue: 'unread',
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    values: ['web', 'mobile'],
    defaultValue: 'web',
  },

  updatedBy: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.fn('NOW'),
  },
});

module.exports = { FeedbackModel };
