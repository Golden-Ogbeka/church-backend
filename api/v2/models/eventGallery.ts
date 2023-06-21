import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';
import { EventModel } from './event';

export interface EventGalleryModelAttributes
  extends Model<
    InferAttributes<EventGalleryModelAttributes>,
    InferCreationAttributes<EventGalleryModelAttributes>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  imageURL: string;
  event_id: number;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const EventGalleryModel =
  sequelizeInstance.define<EventGalleryModelAttributes>('event_gallery', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imageURL: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.fn('NOW'),
    },
  });
