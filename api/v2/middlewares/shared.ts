import { ChurchesModel } from '../models/churches';
import { TFCCLeaderModel } from '../models/tfccLeader';
import { TFCCZoneModel } from '../models/tfccZone';

export const isValidAPI = async (value: string) => {
  const API_KEY = process.env.API_KEY;
  if (API_KEY !== value) {
    throw new Error('Invalid API key');
  }

  return true;
};

export const isValidID = (id: string) => {
  if (!Number.isInteger(parseInt(id))) {
    throw new Error('Invalid ID');
  }
  return true;
};

export const isValidSource = (source: string) => {
  if (!['web', 'mobile'].includes(source)) {
    throw new Error('Source should be either web or mobile');
  }
  return true;
};

export const isValidEventType = (type: string) => {
  if (!['offline', 'online'].includes(type)) {
    throw new Error('Event Type should be either offline or online');
  }
  return true;
};

export const isValidStatus = (status: string) => {
  if (!['pending', 'approved', 'declined', 'archived'].includes(status)) {
    throw new Error(
      'Status should be either pending, approved, declined, archived'
    );
  }
  return true;
};

export const isValidAdminRole = (source: string) => {
  if (!['admin', 'superAdmin'].includes(source)) {
    throw new Error('Admin Role should be either admin or superAdmin');
  }
  return true;
};

export const isValidZoneId = async (zone: string) => {
  if (!zone) throw new Error('Invalid Zone!');

  const isValidZone = await TFCCZoneModel.findOne({
    where: {
      zone_id: zone,
    },
  });

  if (!isValidZone) throw new Error('Invalid Zone!');

  return true;
};
export const doesZoneExist = async (zone: string) => {
  const isValidZone = await TFCCZoneModel.findOne({
    where: {
      zonal: zone,
    },
  });

  if (isValidZone) throw new Error('Zone already exists!');

  return true;
};
export const isValidLeaderId = async (id: string) => {
  if (!id) throw new Error('Invalid Leader ID!');

  const isValidLeader = await TFCCLeaderModel.findOne({
    where: {
      id,
    },
  });

  if (!isValidLeader) throw new Error('Invalid Leader ID!');

  return true;
};
export const isValidChurchId = async (id: string) => {
  if (!id) throw new Error('Invalid Church ID!');

  const isValidChurch = await ChurchesModel.findOne({
    where: {
      church_id: id,
    },
  });

  if (!isValidChurch) throw new Error('Invalid Church ID!');

  return true;
};
