import { validationResult } from 'express-validator';
import express from 'express';
import { DepartmentModel } from '../models/department';
import {
  BulletinSubscribersModel,
  BulletinSubscribersModelAttributes,
} from '../models/bulletinSubscribers';
import { getSequelizeDateFilters } from '../../../functions/filters';
import { getResponseVariables, paginate } from '../../../functions/pagination';

export default () => {
  const GetAllSubscribers = async (
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

      // find all units
      const unitsData = await BulletinSubscribersModel.findAndCountAll({
        order: [['id', 'ASC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All Subscribers Retrieved',
        data: getResponseVariables(unitsData, limit),
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewSubscriber = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find unit
      const unitData = await BulletinSubscribersModel.findByPk(id);

      if (!unitData)
        return res.status(404).json({ message: 'Subscriber not found' });

      return res.status(200).json({
        message: 'Subscriber retrieved',
        unit: unitData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const Subscribe = async (
    req: express.Request<never, never, BulletinSubscribersModelAttributes>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { address } = req.body;

      // check if unit exists
      let existingSubscriber = await BulletinSubscribersModel.findOne({
        where: { address },
      });

      // Still allows those that have subscribed before but don't save the new details
      if (existingSubscriber && Object.keys(existingSubscriber.toJSON()).length)
        return res.status(200).json({ message: 'User subscribed' });

      let newSubscriber = await BulletinSubscribersModel.create({
        address,
      });

      return res.status(200).json({
        message: 'Subscription successful',
        unit: newSubscriber,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateSubscriber = async (
    req: express.Request<
      { id: string },
      never,
      BulletinSubscribersModelAttributes
    >,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { subscribed } = req.body;
      const { id } = req.params;

      // check if unit exists
      let existingSubscriber = await BulletinSubscribersModel.findByPk(id);
      if (!existingSubscriber)
        return res.status(400).json({ message: 'Subscriber not found' });

      // Check if other unit exists with this name

      existingSubscriber.subscribed = subscribed;

      existingSubscriber.save();

      return res.status(200).json({
        message: 'Subscriber Updated',
        unit: existingSubscriber,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteSubscriber = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // check if unit exists
      let existingSubscriber = await BulletinSubscribersModel.findByPk(id);
      if (!existingSubscriber)
        return res.status(400).json({ message: 'Subscriber not found' });

      await existingSubscriber.destroy();

      return res.status(200).json({
        message: 'Subscriber Deleted',
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllSubscribers,
    ViewSubscriber,
    Subscribe,
    DeleteSubscriber,
    UpdateSubscriber,
  };
};
