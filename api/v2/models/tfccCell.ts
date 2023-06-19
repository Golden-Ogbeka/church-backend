import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';
import { ChurchesModel } from './churches';
import { TFCCLeaderModel } from './tfccLeader';
import { TFCCZoneModel } from './tfccZone';

export interface TFCCCellModelAttributes
  extends Model<
    InferAttributes<TFCCCellModelAttributes>,
    InferCreationAttributes<TFCCCellModelAttributes>
  > {
  cell_id: CreationOptional<number>;
  church_id: string;
  zone_id: string;
  host_address: string;
  cell_leader: string;
  cell_leader_id: number;
  phone: string;
  email: CreationOptional<string>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const TFCCCellModel = sequelizeInstance.define<TFCCCellModelAttributes>(
  'tfccCell',
  {
    cell_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    church_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    zone_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    host_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cell_leader: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cell_leader_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
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
    tableName: 'cell_tbl', // to be changed to tfcc_cells
    paranoid: true,
  }
);

TFCCCellModel.belongsTo(ChurchesModel, {
  foreignKey: 'church_id',
});

TFCCCellModel.belongsTo(TFCCZoneModel, {
  foreignKey: 'zone_id',
});

TFCCCellModel.belongsTo(TFCCLeaderModel, {
  foreignKey: 'cell_leader_id',
});
