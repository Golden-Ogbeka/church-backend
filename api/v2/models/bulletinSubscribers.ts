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

export interface BulletinSubscribersModelAttributes
  extends Model<
    InferAttributes<BulletinSubscribersModelAttributes>,
    InferCreationAttributes<BulletinSubscribersModelAttributes>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  address: string;
  subscribed: CreationOptional<boolean>;
  flagz: CreationOptional<boolean>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const BulletinSubscribersModel =
  sequelizeInstance.define<BulletinSubscribersModelAttributes>(
    'bulletinSubscribers',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subscribed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      flagz: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
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
      tableName: 'elists7', // to be changed to bulletin_subscribers
      paranoid: true,
    }
  );
