import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export interface DevotionalModelAttributes
  extends Model<
    InferAttributes<DevotionalModelAttributes>,
    InferCreationAttributes<DevotionalModelAttributes>
  > {
  dish_id: CreationOptional<number>;
  titles: string;
  scripture1: string;
  scripture2: string;
  main_text: string;
  contents: string;
  ditto: Date; // Date
  years: CreationOptional<string>;
  months: CreationOptional<string>;
  days: CreationOptional<string>;
  nu_url: CreationOptional<string>;
  views: CreationOptional<number>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
  createdBy: CreationOptional<string>;
  updatedBy: CreationOptional<string>;
}

export const DevotionalModel =
  sequelizeInstance.define<DevotionalModelAttributes>(
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
