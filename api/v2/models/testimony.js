const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');

const TestimonyModel = sequelizeInstance.define(
  'testimony',
  {
    test_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    titles: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    main_gist: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ditto: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW'),
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ['pending', 'approved', 'declined', 'archived'],
      defaultValue: 'pending',
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
  },
  {
    tableName: 'tbl_675',
    paranoid: true,
  }
);

module.exports = { TestimonyModel };
