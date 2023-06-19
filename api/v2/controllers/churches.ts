import { validationResult } from 'express-validator';
import express from 'express';
import { DepartmentModel } from '../models/department';
import { ChurchesModel, ChurchesModelAttributes } from '../models/churches';

export default () => {
  const GetAllChurches = async (
    req: express.Request<never, never, never, never>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // find all churches
      const churchesData = await ChurchesModel.findAll({
        order: [['church_id', 'ASC']],
      });

      return res.status(200).json({
        message: 'All Churches Retrieved',
        data: churchesData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewChurch = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find church
      const churchData = await ChurchesModel.findByPk(id);

      if (!churchData)
        return res.status(404).json({ message: 'Church not found' });

      return res.status(200).json({
        message: 'Church retrieved',
        church: churchData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddChurch = async (
    req: express.Request<never, never, ChurchesModelAttributes>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { church_label, location, address, contact_phone, contact_email } =
        req.body;

      // check if church exists
      let existingChurch = await ChurchesModel.findOne({
        where: { church_label },
      });
      if (existingChurch && Object.keys(existingChurch.toJSON()).length)
        return res.status(400).json({ message: 'Church already exists' });

      let newChurch = await ChurchesModel.create({
        church_label,
        location,
        address,
        contact_phone,
        contact_email,
      });

      return res.status(200).json({
        message: 'Church Added',
        church: newChurch,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateChurch = async (
    req: express.Request<{ id: string }, never, ChurchesModelAttributes>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { church_label, location, address, contact_phone, contact_email } =
        req.body;
      const { id } = req.params;

      // check if church exists
      let existingChurch = await ChurchesModel.findByPk(id);
      if (!existingChurch)
        return res.status(400).json({ message: 'Church not found' });

      // Check if other church exists with this name
      if (church_label) {
        const existingChurchWithName = await ChurchesModel.findOne({
          where: { church_label },
        });
        if (
          existingChurchWithName &&
          JSON.stringify(existingChurchWithName) !==
            JSON.stringify(existingChurch)
        )
          return res
            .status(400)
            .json({ message: 'Church with this name already exists' });
      }

      existingChurch.church_label = church_label || existingChurch.church_label;
      existingChurch.location = location || existingChurch.location;
      existingChurch.address = address || existingChurch.address;
      existingChurch.contact_phone =
        contact_phone || existingChurch.contact_phone;
      existingChurch.contact_email =
        contact_email || existingChurch.contact_email;

      existingChurch.save();

      return res.status(200).json({
        message: 'Church Updated',
        church: existingChurch,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteChurch = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // check if church exists
      let existingChurch = await ChurchesModel.findByPk(id);
      if (!existingChurch)
        return res.status(400).json({ message: 'Church not found' });

      await existingChurch.destroy();

      return res.status(200).json({
        message: 'Church Deleted',
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllChurches,
    ViewChurch,
    AddChurch,
    DeleteChurch,
    UpdateChurch,
  };
};
