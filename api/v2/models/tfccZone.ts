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

export interface TFCCZoneModelAttributes
  extends Model<
    InferAttributes<TFCCZoneModelAttributes>,
    InferCreationAttributes<TFCCZoneModelAttributes>
  > {
  zone_id: CreationOptional<number>;
  church_id: string;
  zonal: string;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const TFCCZoneModel = sequelizeInstance.define<TFCCZoneModelAttributes>(
  'tfccZone',
  {
    zone_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    church_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    zonal: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'Name of Zone',
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
    tableName: 'zone_tbl', // to be changed to tfcc_zones
  }
);

TFCCZoneModel.belongsTo(ChurchesModel, {
  foreignKey: 'church_id',
});
