import { UserModel } from './user';
import Sequelize from 'sequelize';
import { sequelizeInstance } from '../../../config/db';
import { DepartmentModel } from './department';
import { UnitModel } from './unit';
import { AdminModel } from './admin';
import { DevotionalModel } from './devotional';
import { TFCCLeaderModel } from './tfccLeader';
import { ChurchesModel } from './churches';
import { TFCCZoneModel } from './tfccZone';
import { TFCCCellModel } from './tfccCell';
import { VisitorModel } from './visitor';
import { AssignedFirstTimerModel } from './assignedFirstTimer';
import { AssignedSecondTimerModel } from './assignedSecondTimer';
import { BulletinSubscribersModel } from './bulletinSubscribers';
import { EventModel } from './event';
import { EventGalleryModel } from './eventGallery';
import { TestimonyModel } from './testimony';
import { FeedbackModel } from './feedback';

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
sequelizeDB.DevotionalModel = DevotionalModel;
sequelizeDB.TFCCLeaderModel = TFCCLeaderModel;
sequelizeDB.ChurchesModel = ChurchesModel;
sequelizeDB.TFCCZoneModel = TFCCZoneModel;
sequelizeDB.TFCCCellModel = TFCCCellModel;
sequelizeDB.VisitorModel = VisitorModel;
sequelizeDB.AssignedFirstTimerModel = AssignedFirstTimerModel;
sequelizeDB.AssignedSecondTimerModel = AssignedSecondTimerModel;
sequelizeDB.BulletinSubscribersModel = BulletinSubscribersModel;
sequelizeDB.EventModel = EventModel;
sequelizeDB.EventGalleryModel = EventGalleryModel;
sequelizeDB.TestimonyModel = TestimonyModel;
sequelizeDB.TestimonyModel = FeedbackModel;

// Associations
Object.keys(sequelizeDB).forEach((modelName) => {
  if (sequelizeDB[modelName].associate) {
    sequelizeDB[modelName].associate(sequelizeDB);
  }
});

sequelizeDB.sequelize = sequelizeInstance;
sequelizeDB.Sequelize = Sequelize;

export default sequelizeDB;
