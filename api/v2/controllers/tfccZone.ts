import { validationResult } from 'express-validator';
import express from 'express';
import { TFCCZoneModel, TFCCZoneModelAttributes } from '../models/tfccZone';

export default () => {
  const GetAllZones = async (
    req: express.Request<
      never,
      never,
      never,
      { page: number; limit: number; from: string; to: string }
    >,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // find all zones

      const zonesData = await TFCCZoneModel.findAll({
        order: [['zonal', 'ASC']],
      });

      return res.status(200).json({
        message: 'All Zones Retrieved',
        data: zonesData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewZone = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find zone

      const zoneData = await TFCCZoneModel.findByPk(id);

      if (!zoneData) return res.status(404).json({ message: 'Zone not found' });

      return res.status(200).json({
        message: 'Zone retrieved successfully',
        zone: zoneData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddZone = async (
    req: express.Request<never, never, { name: string; church_id: string }>,
    res: express.Response
  ) => {
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
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateZone = async (
    req: express.Request<
      { id: string },
      never,
      { name: string; church_id: string }
    >,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { name, church_id } = req.body;

      const { id } = req.params;

      // Check if Zone exists
      const existingZone: TFCCZoneModelAttributes | null =
        await TFCCZoneModel.findByPk(id);

      if (!existingZone)
        return res.status(404).json({ message: 'Zone not found' });

      existingZone.zonal = name;
      existingZone.church_id = church_id;

      await existingZone.save();

      return res.status(200).json({
        message: 'Zone updated successfully',
        zone: existingZone,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteZone = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
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
    } catch (error: any) {
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
