import { DataTypes, Sequelize } from 'sequelize';
import { sequelizeInstance } from '../../../config/db';
// import { sequelizeInstance } from '.';

export const UserModel = sequelizeInstance.define(
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
      type: DataTypes.STRING,
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
    },
    hods: {
      type: DataTypes.CHAR,
      comment: '1 if user is a HOD, 0 if not 0',
      values: ['1', '0'],
    },
    hous: {
      type: DataTypes.CHAR,
      comment: '1 if user is a TFCC Leader, 0 if not 0',
      values: ['1', '0'],
    },
    dcns: {
      type: DataTypes.CHAR,
      comment: '1 if user is a Deacon, 0 if not 0',
      values: ['1', '0'],
    },
    flagz: {
      type: DataTypes.CHAR,
      values: ['1', '0'],
    },
    subscribed: {
      type: DataTypes.CHAR,
      comment: '1 if user is subscribed to newsletter, 0 if not 0',
      values: ['1', '0'],
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
    password: { type: DataTypes.STRING },
    verificationCode: { type: DataTypes.STRING, allowNull: false },
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
  }
);
