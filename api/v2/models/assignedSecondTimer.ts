import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';
import { TFCCLeaderModel } from './tfccLeader';
import { VisitorModel } from './visitor';

export interface AssignedSecondTimerModelAttributes
  extends Model<
    InferAttributes<AssignedSecondTimerModelAttributes>,
    InferCreationAttributes<AssignedSecondTimerModelAttributes>
  > {
  id: CreationOptional<number>;
  case_id: CreationOptional<string>;
  v_id: number;
  names: string;
  address: string;
  gender: string;
  phone: string;
  assigned: string;
  assigned_id: number;
  status: CreationOptional<string>;
  response: CreationOptional<string>;
  assigned_p: string;
  ditto: string;
  nearest: string;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const AssignedSecondTimerModel =
  sequelizeInstance.define<AssignedSecondTimerModelAttributes>(
    'assignedSecondTimer',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      v_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1, // in case it's empty
      },
      case_id: {
        type: DataTypes.STRING,
      },
      names: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      assigned_id: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
        values: ['Male', 'Female'],
      },
      phone: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        values: ['Open', 'Closed'],
      },
      response: {
        type: DataTypes.STRING,
      },
      assigned_p: {
        type: DataTypes.STRING,
      },
      ditto: {
        type: DataTypes.DATE,
      },
      nearest: {
        type: DataTypes.STRING,
      },
      assigned: {
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
      tableName: 'assigned_cases1', //to be changed to assigned_second_timers
      paranoid: true,
    }
  );

AssignedSecondTimerModel.belongsTo(VisitorModel, {
  foreignKey: { name: 'v_id', allowNull: true },
  constraints: false,
});

AssignedSecondTimerModel.belongsTo(TFCCLeaderModel, {
  foreignKey: { name: 'assigned_id', allowNull: true },
  constraints: false,
});
