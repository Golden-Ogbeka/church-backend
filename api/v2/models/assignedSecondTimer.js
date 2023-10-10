const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');
const { TFCCLeaderModel } = require('./tfccLeader');
const { VisitorModel } = require('./visitor');

const AssignedSecondTimerModel = sequelizeInstance.define(
  'assignedSecondTimer',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: true,
      defaultValue: 0,
    },
    v_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // in case it's empty
    },
    case_id: {
      type: DataTypes.STRING,
    },
    names: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    assigned_id: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.STRING,
      values: ['Male', 'Female'],
    },
    phone: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
      values: ['Open', 'Closed'],
    },
    response: {
      type: DataTypes.STRING,
    },
    assigned_p: {
      type: DataTypes.STRING,
    },
    ditto: {
      type: DataTypes.DATE,
    },
    nearest: {
      type: DataTypes.STRING,
    },
    assigned: {
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
    tableName: 'assigned_cases1', //to be changed to assigned_second_timers
    paranoid: true,
  }
);

AssignedSecondTimerModel.belongsTo(VisitorModel, {
  foreignKey: { name: 'v_id', allowNull: true },
  constraints: false,
});

AssignedSecondTimerModel.belongsTo(TFCCLeaderModel, {
  foreignKey: { name: 'assigned_id', allowNull: true },
  constraints: false,
});

module.exports = { AssignedSecondTimerModel };
