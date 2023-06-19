import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export interface ChurchesModelAttributes
  extends Model<
    InferAttributes<ChurchesModelAttributes>,
    InferCreationAttributes<ChurchesModelAttributes>
  > {
  church_id: CreationOptional<number>;
  church_label: string;
  location: string;
  address: string;
  contact_phone: string;
  contact_email: string;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const ChurchesModel = sequelizeInstance.define<ChurchesModelAttributes>(
  'church',
  {
    church_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    church_label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_email: {
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
    tableName: 'church_cat', // to be changed to church
    paranoid: true,
  }
);
