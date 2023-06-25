import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export interface FeedbackModelAttributes
  extends Model<
    InferAttributes<FeedbackModelAttributes>,
    InferCreationAttributes<FeedbackModelAttributes>
  > {
  id: CreationOptional<number>;
  fullName: string;
  email: CreationOptional<string>;
  phoneNumber: CreationOptional<string>;
  content: string;
  status: CreationOptional<'read' | 'unread'>;
  source: CreationOptional<'web' | 'mobile'>;
  updatedBy: CreationOptional<string>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const FeedbackModel = sequelizeInstance.define<FeedbackModelAttributes>(
  'feedback',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ['read', 'unread'],
      defaultValue: 'unread',
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
  }
);
