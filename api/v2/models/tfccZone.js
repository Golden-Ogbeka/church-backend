const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');
const { ChurchesModel } = require('./churches');

const TFCCZoneModel = sequelizeInstance.define(
  'tfccZone',
  {
    zone_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    church_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    zonal: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of Zone',
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
    tableName: 'zone_tbl', // to be changed to tfcc_zones
  }
);

TFCCZoneModel.belongsTo(ChurchesModel, {
  foreignKey: 'church_id',
  constraints: false,
});

module.exports = { TFCCZoneModel };
