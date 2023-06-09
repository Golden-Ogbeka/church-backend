import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export interface AdminModelAttributes
  extends Model<
    InferAttributes<AdminModelAttributes>,
    InferCreationAttributes<AdminModelAttributes>
  > {
  // Some fields are optional when calling AdminModel.create() or AdminModel.build()
  id: CreationOptional<number>;
  fullname: string;
  email: string;
  avatar: CreationOptional<string>;
  role: string;
  password: string;
  active: CreationOptional<boolean>;
  verificationCode: CreationOptional<string>;
  updatedBy: CreationOptional<string>;
  createdBy: CreationOptional<string>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const AdminModel = sequelizeInstance.define<AdminModelAttributes>(
  'admin',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin',
      values: ['admin', 'superAdmin'],
    },
    // Password Controls
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verificationCode: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    paranoid: true, //for soft delete
    defaultScope: {
      attributes: { exclude: ['password', 'verificationCode'] },
    },
  }
);
