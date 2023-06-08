import { UserModel } from './user';
import Sequelize from 'sequelize';
import { sequelizeInstance } from '../../../config/db';
import { DepartmentModel } from './department';
import { UnitModel } from './unit';
import { AdminModel } from './admin';

const sequelizeDB: any = {};

// Code to import the models automatically. Fails at require
// fs.readdirSync(__dirname)
//   .filter((file) => {
//     return (
//       file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.ts'
//     );
//   })
//   .forEach((file) => {
//     console.log(file, __dirname);

//     const model = require(path.join(__dirname, file))(
//       Sequelize,
//       Sequelize.DataTypes
//     );
//     sequelizeDB[model.name] = model;
//   });

// Models
sequelizeDB.UserModel = UserModel;
sequelizeDB.DepartmentModel = DepartmentModel;
sequelizeDB.UnitModel = UnitModel;
sequelizeDB.AdminModel = AdminModel;

// Associations
Object.keys(sequelizeDB).forEach((modelName) => {
  if (sequelizeDB[modelName].associate) {
    sequelizeDB[modelName].associate(sequelizeDB);
  }
});

sequelizeDB.sequelize = sequelizeInstance;
sequelizeDB.Sequelize = Sequelize;

export default sequelizeDB;
