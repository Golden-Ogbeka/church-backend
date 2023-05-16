import jwt from 'jsonwebtoken';
import TFCCZoneModel from '../models/tfccZone.model';

export const isValidZone = async (zone: string) => {
  if (!zone) throw new Error('Invalid Zone!');

  const isValidZone = await TFCCZoneModel.findOne({
    name: zone,
  });

  if (!isValidZone) throw new Error('Invalid Zone!');

  return true;
};
export const doesZoneExist = async (zone: string) => {
  const isValidZone = await TFCCZoneModel.findOne({
    name: zone,
  });

  if (isValidZone) throw new Error('Zone already exists!');

  return true;
};
