const TFCCZoneModel = require('../models/tfccZone.model');

const isValidZone = async (zone) => {
  if (!zone) throw new Error('Invalid Zone!');

  const isValidZone = await TFCCZoneModel.findOne({
    name: zone,
  });

  if (!isValidZone) throw new Error('Invalid Zone!');

  return true;
};
const doesZoneExist = async (zone) => {
  const isValidZone = await TFCCZoneModel.findOne({
    name: zone,
  });

  if (isValidZone) throw new Error('Zone already exists!');

  return true;
};

module.exports = {
  isValidZone,
  doesZoneExist,
};
