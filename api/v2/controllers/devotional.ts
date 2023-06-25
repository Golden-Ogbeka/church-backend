import { DevotionalModelAttributes } from './../models/devotional';
import { getTodaysDate } from './../../../functions/date';
import { getSQLUserDetails, getUserDetails } from './../../../functions/auth';
import { DevotionalType } from './../../../types/index';
import { getPaginationOptions } from './../../../utils/pagination';
import { validationResult } from 'express-validator';
import express from 'express';
import {
  getDateFilters,
  getSequelizeDateFilters,
} from '../../../functions/filters';
import { DevotionalModel } from '../models/devotional';
import { getResponseVariables, paginate } from '../../../functions/pagination';
import { Op } from 'sequelize';

export default () => {
  const GetAllDevotionals = async (
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

      const { from, to, limit, page } = req.query;

      // find all devotionals

      const devotionalsData = await DevotionalModel.findAndCountAll({
        order: [['ditto', 'DESC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All Devotionals Retrieved',
        data: getResponseVariables(devotionalsData, limit),
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetDevotionalsForUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // Get devotionals for user: Limited to the last 10 devotionals
      const limit = 31;

      const devotionalsData = await DevotionalModel.findAndCountAll({
        order: [['ditto', 'DESC']],
        where: { ditto: { [Op.lte]: new Date() } },
      });

      return res.status(200).json({
        message: 'Devotionals Retrieved',
        data: getResponseVariables(devotionalsData, limit),
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  interface DevotionalBodyType {
    date: any;
    title: string;
    text: string;
    textReference: string;
    mainText: string;
    content: string;
  }

  const AddDevotional = async (
    req: express.Request<never, never, DevotionalBodyType>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { date, title, text, mainText, content, textReference } = req.body;

      const userDetails = await getSQLUserDetails(req as any);

      // Check if devotional exists for this date

      const existingDevotional = await DevotionalModel.findOne({
        where: { ditto: new Date(date) },
      });
      if (existingDevotional)
        return res
          .status(400)
          .json({ message: 'Devotional for this date already exists' });

      const newDevotional: DevotionalModelAttributes =
        await DevotionalModel.create({
          ditto: new Date(date),
          titles: title,
          scripture1: text,
          scripture2: textReference,
          main_text: mainText,
          contents: content,
          createdBy: userDetails.fullname,
        });

      await newDevotional.save();

      return res.status(200).json({
        message: 'Devotional added successfully',
        devotional: newDevotional,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewDevotional = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find devotional
      const devotionalData = await DevotionalModel.findOne({
        where: { dish_id: id },
      });

      if (!devotionalData)
        return res.status(404).json({ message: 'Devotional not found' });

      //increase views
      devotionalData.increment('views');

      return res.status(200).json({
        message: 'Devotional retrieved',
        devotional: devotionalData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetDayDevotional = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // Get today's date
      const todaysDate = getTodaysDate();

      // find devotional

      const devotionalData = await DevotionalModel.findOne({
        where: {
          ditto: {
            [Op.gte]: new Date(todaysDate),
            [Op.lte]: new Date(todaysDate),
          },
        },
      });

      if (!devotionalData)
        return res.status(404).json({ message: 'Devotional not found' });

      //increase views
      devotionalData.increment('views');

      return res.status(200).json({
        message: 'Devotional retrieved',
        devotional: devotionalData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteDevotional = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find devotional

      const devotionalData = await DevotionalModel.findByPk(id);

      if (!devotionalData)
        return res.status(404).json({ message: 'Devotional not found' });

      await DevotionalModel.destroy({ where: { dish_id: id } });

      return res.status(200).json({
        message: 'Devotional deleted',
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateDevotional = async (
    req: express.Request<never, never, DevotionalBodyType & { id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id, date, title, text, mainText, content, textReference } =
        req.body;

      const userDetails = await getSQLUserDetails(req as any);

      const existingDevotional = await DevotionalModel.findByPk(id);
      if (!existingDevotional)
        return res.status(404).json({ message: 'Devotional not found' });

      // Check if devotional exists for this date
      const existingDevotionalWithDate = await DevotionalModel.findOne({
        where: {
          ditto: new Date(date),
        },
      });
      if (
        existingDevotionalWithDate &&
        JSON.stringify(existingDevotionalWithDate.toJSON()) !==
          JSON.stringify(existingDevotional.toJSON())
      )
        return res
          .status(400)
          .json({ message: 'Devotional for this date already exists' });

      existingDevotional.ditto = new Date(date);
      existingDevotional.titles = title;
      existingDevotional.scripture1 = text;
      existingDevotional.scripture2 = textReference;
      existingDevotional.main_text = mainText;
      existingDevotional.contents = content;
      existingDevotional.updatedBy = userDetails.fullname;

      await existingDevotional.save();

      return res.status(200).json({
        message: 'Devotional updated successfully',
        devotional: existingDevotional,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllDevotionals,
    AddDevotional,
    ViewDevotional,
    GetDayDevotional,
    DeleteDevotional,
    UpdateDevotional,
    GetDevotionalsForUser,
  };
};
