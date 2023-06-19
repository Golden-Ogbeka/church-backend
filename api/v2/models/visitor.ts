import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export interface VisitorModelAttributes
  extends Model<
    InferAttributes<VisitorModelAttributes>,
    InferCreationAttributes<VisitorModelAttributes>
  > {
  id: CreationOptional<number>;
  fname: string;
  lname: string;
  address: string;
  nearest: string;
  marital: string;
  gender: string;
  phone: string;
  email: CreationOptional<string>;
  contact_mode: CreationOptional<string>;
  service_opinion: CreationOptional<string>;
  suggestions: CreationOptional<string>;
  membership: CreationOptional<string>;
  dated: Date;
  assigned: CreationOptional<boolean>;
  category: string;
  timer2: boolean;
  timer21: boolean;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const VisitorModel = sequelizeInstance.define<VisitorModelAttributes>(
  'visitor',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fname: {
      type: DataTypes.STRING,
    },
    lname: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    nearest: {
      type: DataTypes.STRING,
    },
    marital: {
      type: DataTypes.STRING,
      values: ['Married', 'Single', 'Widowed', 'Divorced', 'Engaged'],
    },
    gender: {
      type: DataTypes.STRING,
      values: ['Male', 'Female'],
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    contact_mode: {
      type: DataTypes.STRING,
    },
    service_opinion: {
      type: DataTypes.STRING,
      values: ['Poor', 'Fair', 'Good', 'Excellent'],
    },
    suggestions: {
      type: DataTypes.STRING,
    },
    membership: {
      type: DataTypes.STRING,
    },
    dated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    assigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timer2: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    timer21: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    tableName: 'visitor',
    paranoid: true,
  }
);
