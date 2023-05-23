import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export interface DepartmentModelAttributes
  extends Model<
    InferAttributes<DepartmentModelAttributes>,
    InferCreationAttributes<DepartmentModelAttributes>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  names: string;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const DepartmentModel = sequelizeInstance.define<DepartmentModelAttributes>(
  'department',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    tableName: 'tbl_dept', // to be changed to departments
  }
);

// DepartmentModel.hasMany(UserModel, {
//   foreignKey: 'dept',
// });
