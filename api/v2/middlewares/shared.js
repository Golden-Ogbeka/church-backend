const { ChurchesModel } = require('../models/churches');
const { TFCCLeaderModel } = require('../models/tfccLeader');
const { TFCCZoneModel } = require('../models/tfccZone');

const isValidAPI = async (value) => {
  const API_KEY = process.env.API_KEY;
  if (API_KEY !== value) {
    throw new Error('Invalid API key');
  }

  return true;
};

const isValidID = (id) => {
  if (!Number.isInteger(parseInt(id))) {
    throw new Error('Invalid ID');
  }
  return true;
};

const isValidSource = (source) => {
  if (!['web', 'mobile'].includes(source)) {
    throw new Error('Source should be either web or mobile');
  }
  return true;
};

const isValidEventType = (type) => {
  if (!['offline', 'online'].includes(type)) {
    throw new Error('Event Type should be either offline or online');
  }
  return true;
};

const isValidStatus = (status) => {
  if (!['pending', 'approved', 'declined', 'archived'].includes(status)) {
    throw new Error(
      'Status should be either pending, approved, declined, archived'
    );
  }
  return true;
};

const isValidAdminRole = (source) => {
  if (!['admin', 'superAdmin'].includes(source)) {
    throw new Error('Admin Role should be either admin or superAdmin');
  }
  return true;
};

const isValidZoneId = async (zone) => {
  if (!zone) throw new Error('Invalid Zone!');

  const isValidZone = await TFCCZoneModel.findOne({
    where: {
      zone_id: zone,
    },
  });

  if (!isValidZone) throw new Error('Invalid Zone!');

  return true;
};
const doesZoneExist = async (zone) => {
  const isValidZone = await TFCCZoneModel.findOne({
    where: {
      zonal: zone,
    },
  });

  if (isValidZone) throw new Error('Zone already exists!');

  return true;
};
const isValidLeaderId = async (id) => {
  if (!id) throw new Error('Invalid Leader ID!');

  const isValidLeader = await TFCCLeaderModel.findOne({
    where: {
      id,
    },
  });

  if (!isValidLeader) throw new Error('Invalid Leader ID!');

  return true;
};
const isValidChurchId = async (id) => {
  if (!id) throw new Error('Invalid Church ID!');

  const isValidChurch = await ChurchesModel.findOne({
    where: {
      church_id: id,
    },
  });

  if (!isValidChurch) throw new Error('Invalid Church ID!');

  return true;
};

module.exports = {
  isValidAPI,
  isValidAdminRole,
  isValidChurchId,
  isValidLeaderId,
  isValidZoneId,
  doesZoneExist,
  isValidStatus,
  isValidEventType,
  isValidID,
  isValidSource,
};
