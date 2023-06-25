import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeInstance } from '../../../config/db';

export interface TestimonyModelAttributes
  extends Model<
    InferAttributes<TestimonyModelAttributes>,
    InferCreationAttributes<TestimonyModelAttributes>
  > {
  test_id: CreationOptional<number>;
  names: string;
  email: CreationOptional<string>;
  phoneNumber: CreationOptional<string>;
  titles: string;
  main_gist: string;
  ditto: CreationOptional<Date>;
  status: CreationOptional<'pending' | 'approved' | 'declined' | 'archived'>;
  source: CreationOptional<'web' | 'mobile'>;
  updatedBy: CreationOptional<string>;
  createdAt: CreationOptional<string>;
  updatedAt: CreationOptional<string>;
}

export const TestimonyModel =
  sequelizeInstance.define<TestimonyModelAttributes>(
    'testimony',
    {
      test_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      names: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      titles: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      main_gist: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ditto: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ['pending', 'approved', 'declined', 'archived'],
        defaultValue: 'pending',
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
        values: ['web', 'mobile'],
        defaultValue: 'web',
      },

      updatedBy: {
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
      tableName: 'tbl_675',
      paranoid: true,
    }
  );
