const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');

const BulletinSubscribersModel = sequelizeInstance.define(
  'bulletinSubscribers',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
      defaultValue: 0,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subscribed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    flagz: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
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
    tableName: 'elists7', // to be changed to bulletin_subscribers
    paranoid: true,
  }
);

module.exports = { BulletinSubscribersModel };
