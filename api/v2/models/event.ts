import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';
import { DepartmentModel } from './department';
import { EventGalleryModel } from './eventGallery';

export interface EventModelAttributes
  extends Model<
    InferAttributes<EventModelAttributes>,
    InferCreationAttributes<EventModelAttributes>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  name: string;
  theme: CreationOptional<string>; //Topic of event
  mainText: CreationOptional<string>; // Bible verse of event
  date: Date; // Event dates would be entered as desired. E.g: Every Tuesday in August
  time: string; // Time would also be entered as desired. E.g: 6pm on Tuesday, 8pm on Monday and Saturday
  allowRegistration: boolean;
  limitedNumberRegistration: boolean; // if the registration has a number limit
  registrationNumberLimit: CreationOptional<number>;
  limitedDateRegistration: boolean; // if the registration has a date limit
  registrationDateLimit: CreationOptional<Date>;
  // Event Image
  poster: CreationOptional<string>;
  requiredRegistrationDetails: CreationOptional<any>;
  registrationEntries: CreationOptional<any>; // each event would determine the data it aims to collect
  eventType: string;
  description: CreationOptional<string>;
  location: CreationOptional<string>;
  createdBy: CreationOptional<string>;
  updatedBy: CreationOptional<string>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const EventModel = sequelizeInstance.define<EventModelAttributes>(
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      get() {
        const rawValue = this.getDataValue('requiredRegistrationDetails');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      defaultValue: JSON.stringify([]),
    },
    registrationEntries: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
});
