const { DataTypes, Sequelize } = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');
const { EventGalleryModel } = require('./eventGallery');

const EventModel = sequelizeInstance.define(
  'event',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    theme: {
      type: DataTypes.STRING,
    },
    mainText: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    allowRegistration: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    limitedNumberRegistration: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    registrationNumberLimit: {
      type: DataTypes.INTEGER,
    },
    limitedDateRegistration: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    registrationDateLimit: {
      type: DataTypes.DATE,
    },
    poster: {
      type: DataTypes.STRING,
    },
    requiredRegistrationDetails: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('requiredRegistrationDetails');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      defaultValue: JSON.stringify([]),
    },
    registrationEntries: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('registrationEntries');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      defaultValue: JSON.stringify([]),
    },
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'offline',
      values: ['online', 'offline'],
    },
    description: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.STRING,
    },
    createdBy: {
      type: DataTypes.STRING,
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
    tableName: 'tfhc_events',
    paranoid: true,
  }
);

EventModel.hasMany(EventGalleryModel, {
  foreignKey: 'event_id',
  as: 'gallery',
  constraints: false,
});

module.exports = { EventModel };
