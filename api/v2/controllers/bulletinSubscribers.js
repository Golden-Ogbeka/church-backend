const { validationResult } = require('express-validator');
const { BulletinSubscribersModel } = require('../models/bulletinSubscribers');
const { getSequelizeDateFilters } = require('../../../functions/filters');
const {
  getResponseVariables,
  paginate,
} = require('../../../functions/pagination');

const Controller = () => {
  const GetAllSubscribers = async (req, res) => {
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
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewSubscriber = async (req, res) => {
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
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const Subscribe = async (req, res) => {
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
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateSubscriber = async (req, res) => {
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
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteSubscriber = async (req, res) => {
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
    } catch (error) {
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

module.exports = Controller;
