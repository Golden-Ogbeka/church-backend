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

export interface AssignedFirstTimerModelAttributes
  extends Model<
    InferAttributes<AssignedFirstTimerModelAttributes>,
    InferCreationAttributes<AssignedFirstTimerModelAttributes>
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

export const AssignedFirstTimerModel =
  sequelizeInstance.define<AssignedFirstTimerModelAttributes>(
    'assignedFirstTimer',
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
        comment: "Leader's Name",
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
        defaultValue: 'Open',
      },
      response: {
        type: DataTypes.STRING,
      },
      assigned_p: {
        type: DataTypes.STRING,
        comment: "Leader's Number",
      },
      ditto: {
        type: DataTypes.DATE,
        comment: 'Date the visitor came',
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
      tableName: 'assigned_cases', //to be changed to assigned_first_timers
      paranoid: true,
    }
  );

AssignedFirstTimerModel.belongsTo(VisitorModel, {
  foreignKey: { name: 'v_id', allowNull: true },
  constraints: false,
});

AssignedFirstTimerModel.belongsTo(TFCCLeaderModel, {
  foreignKey: { name: 'assigned_id', allowNull: true },
  constraints: false,
});
