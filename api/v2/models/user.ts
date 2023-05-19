import bcrypt from 'bcryptjs';
import { UnitModel } from './unit';
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

export interface UserModelAttributes
  extends Model<
    InferAttributes<UserModelAttributes>,
    InferCreationAttributes<UserModelAttributes>
  > {
  // Some fields are optional when calling UserModel.create() or UserModel.build()
  id: CreationOptional<number>;
  titles: string;
  names: string;
  address: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  status: CreationOptional<string>;
  dept: CreationOptional<string>;
  d_unit: CreationOptional<string>;
  fname: string;
  lname: string;
  marital: string;
  pastors: CreationOptional<string>;
  hods: CreationOptional<string>;
  hous: CreationOptional<string>;
  dcns: CreationOptional<string>;
  flagz: CreationOptional<string>;
  subscribed: CreationOptional<string>;
  churchCenter: string;
  member: string;
  registrationSource: CreationOptional<string>;
  password: CreationOptional<string>;
  verificationCode: CreationOptional<string>;
  isPasswordSet: CreationOptional<string>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const UserModel = sequelizeInstance.define<UserModelAttributes>(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titles: {
      type: DataTypes.STRING,
    },
    names: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.DATE,
    },
    gender: {
      type: DataTypes.STRING,
      values: ['Male', 'Female'],
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      values: ['Minister', 'Worker', 'Member'],
      defaultValue: 'Member',
    },
    dept: {
      type: DataTypes.STRING,
      comment: 'Department ID if user is a worker',
    },
    d_unit: {
      type: DataTypes.STRING,
      comment: 'Unit ID if user is a worker and belongs to a unit',
    },
    fname: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'First name',
    },
    lname: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Last name',
    },
    marital: {
      type: DataTypes.STRING,
      comment: 'Marital Status',
      values: ['Married', 'Single', 'Widowed', 'Divorced'],
    },
    pastors: {
      type: DataTypes.CHAR,
      comment: '1 if user is a pastor, 0 if not 0',
      values: ['1', '0'],
      defaultValue: '0',
    },
    hods: {
      type: DataTypes.CHAR,
      comment: '1 if user is a HOD, 0 if not 0',
      values: ['1', '0'],
      defaultValue: '0',
    },
    hous: {
      type: DataTypes.CHAR,
      comment: '1 if user is a TFCC Leader, 0 if not 0',
      values: ['1', '0'],
      defaultValue: '0',
    },
    dcns: {
      type: DataTypes.CHAR,
      comment: '1 if user is a Deacon, 0 if not 0',
      values: ['1', '0'],
      defaultValue: '0',
    },
    flagz: {
      type: DataTypes.CHAR,
      values: ['1', '0'],
      defaultValue: '0',
    },
    subscribed: {
      type: DataTypes.CHAR,
      comment: '1 if user is subscribed to newsletter, 0 if not 0',
      values: ['1', '0'],
      defaultValue: '0',
    },

    // Additional Properties
    churchCenter: { type: DataTypes.STRING },
    member: { type: DataTypes.BOOLEAN, defaultValue: true },
    registrationSource: {
      type: DataTypes.STRING,
      allowNull: false,
      values: ['web', 'mobile'],
      defaultValue: 'web',
    },

    // Password Controls
    password: {
      type: DataTypes.STRING,
    },
    verificationCode: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    isPasswordSet: { type: DataTypes.STRING },
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
    tableName: 'tbl_137', // to be changed to users
    paranoid: true, //for soft delete
    defaultScope: {
      attributes: { exclude: ['password', 'verificationCode'] },
    },
  }
);

UserModel.belongsTo(DepartmentModel, {
  foreignKey: 'dept',
});

UserModel.belongsTo(UnitModel, {
  foreignKey: 'd_unit',
});

// UserModel.prototype.toJSON = function () {
//   var values = Object.assign({}, this.get());

//   delete values.password;
//   delete values.verificationCode;
//   return values;
// };
