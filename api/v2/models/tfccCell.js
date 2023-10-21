const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');
const { ChurchesModel } = require('./churches');
const { TFCCLeaderModel } = require('./tfccLeader');
const { TFCCZoneModel } = require('./tfccZone');

const TFCCCellModel = sequelizeInstance.define(
  'tfccCell',
  {
    cell_id: {
      autoIncrement: false,
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    church_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    zone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    host_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cell_leader: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cell_leader_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
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
    tableName: 'cell_tbl', // to be changed to tfcc_cells
    paranoid: true,
  }
);

TFCCCellModel.belongsTo(ChurchesModel, {
  foreignKey: 'church_id',
  constraints: false,
});

TFCCCellModel.belongsTo(TFCCZoneModel, {
  foreignKey: 'zone_id',
  constraints: false,
});

TFCCCellModel.belongsTo(TFCCLeaderModel, {
  foreignKey: 'cell_leader_id',
  constraints: false,
});

module.exports = { TFCCCellModel };
