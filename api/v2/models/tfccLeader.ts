import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export interface TFCCLeaderModelAttributes
  extends Model<
    InferAttributes<TFCCLeaderModelAttributes>,
    InferCreationAttributes<TFCCLeaderModelAttributes>
  > {
  id: CreationOptional<number>;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const TFCCLeaderModel =
  sequelizeInstance.define<TFCCLeaderModelAttributes>(
    'tfccLeader',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobile: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ['Group Leader', 'Cell Leader', 'Admin'],
        defaultValue: 'Cell Leader',
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
      tableName: 'admin_user', // to be changed to tfcc_leaders
      paranoid: true,
    }
  );
