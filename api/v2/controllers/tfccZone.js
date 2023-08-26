const { validationResult } = require('express-validator');
const { TFCCZoneModel } = require('../models/tfccZone');
const { ChurchesModel } = require('../models/churches');

const Controller = () => {
  const GetAllZones = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // find all zones

      const zonesData = await TFCCZoneModel.findAll({
        include: [ChurchesModel],
        order: [['zonal', 'ASC']],
      });

      return res.status(200).json({
        message: 'All Zones Retrieved',
        data: zonesData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewZone = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find zone

      const zoneData = await TFCCZoneModel.findByPk(id, {
        include: [ChurchesModel],
      });

      if (!zoneData) return res.status(404).json({ message: 'Zone not found' });

      return res.status(200).json({
        message: 'Zone retrieved successfully',
        zone: zoneData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddZone = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { name, church_id } = req.body;

      const zoneData = await TFCCZoneModel.create({
        zonal: name,
        church_id,
      });

      return res.status(200).json({
        message: 'TFCC Zone added',
        zone: zoneData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateZone = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { name, church_id } = req.body;

      const { id } = req.params;

      // Check if Zone exists
      const existingZone = await TFCCZoneModel.findByPk(id);

      if (!existingZone)
        return res.status(404).json({ message: 'Zone not found' });

      existingZone.zonal = name;
      existingZone.church_id = church_id;

      await existingZone.save();

      return res.status(200).json({
        message: 'Zone updated successfully',
        zone: existingZone,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteZone = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find zone

      const zoneData = await TFCCZoneModel.findByPk(id);

      if (!zoneData) return res.status(404).json({ message: 'Zone not found' });

      await TFCCZoneModel.destroy({ where: { zone_id: id } });

      return res.status(200).json({
        message: 'Zone deleted Successfully',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllZones,
    AddZone,
    ViewZone,
    UpdateZone,
    DeleteZone,
  };
};

module.exports = Controller;
