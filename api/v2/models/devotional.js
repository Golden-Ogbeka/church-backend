const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');

const DevotionalModel = sequelizeInstance.define(
  'devotional',
  {
    dish_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titles: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    scripture1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scripture2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    main_text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ditto: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    years: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    months: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    days: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nu_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    tableName: 'tfhc_menu', // to be changed to devotional
    paranoid: true,
  }
);

module.exports = { DevotionalModel };
