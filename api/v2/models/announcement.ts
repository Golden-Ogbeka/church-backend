import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export interface AnnouncementModelAttributes
  extends Model<
    InferAttributes<AnnouncementModelAttributes>,
    InferCreationAttributes<AnnouncementModelAttributes>
  > {
  id: CreationOptional<number>;
  title: string;
  details: CreationOptional<string>;
  priority: CreationOptional<number>;
  image: string;
  createdBy: CreationOptional<string>;
  updatedBy: CreationOptional<string>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const AnnouncementModel = sequelizeInstance.define<AnnouncementModelAttributes>(
  'announcement',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
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
  }
);
