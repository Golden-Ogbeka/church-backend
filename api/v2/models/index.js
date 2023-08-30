const Sequelize = require('sequelize');
const { sequelizeInstance } = require('../../../config/db');
const { UserModel } = require('./user');
const { DepartmentModel } = require('./department');
const { UnitModel } = require('./unit');
const { AdminModel } = require('./admin');
const { DevotionalModel } = require('./devotional');
const { TFCCLeaderModel } = require('./tfccLeader');
const { ChurchesModel } = require('./churches');
const { TFCCZoneModel } = require('./tfccZone');
const { TFCCCellModel } = require('./tfccCell');
const { VisitorModel } = require('./visitor');
const { AssignedFirstTimerModel } = require('./assignedFirstTimer');
const { AssignedSecondTimerModel } = require('./assignedSecondTimer');
const { BulletinSubscribersModel } = require('./bulletinSubscribers');
const { EventModel } = require('./event');
const { EventGalleryModel } = require('./eventGallery');
const { TestimonyModel } = require('./testimony');
const { FeedbackModel } = require('./feedback');
const { AnnouncementModel } = require('./announcement');
const sequelizeDB = {};

// Models;
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
sequelizeDB.FeedbackModel = FeedbackModel;
sequelizeDB.AnnouncementModel = AnnouncementModel;

// Associations
Object.keys(sequelizeDB).forEach((modelName) => {
  if (sequelizeDB[modelName].associate) {
    sequelizeDB[modelName].associate(sequelizeDB);
  }
});

sequelizeDB.sequelize = sequelizeInstance;
sequelizeDB.Sequelize = Sequelize;

module.exports = sequelizeDB;
