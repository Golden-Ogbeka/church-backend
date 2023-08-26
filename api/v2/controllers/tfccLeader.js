const { validationResult } = require('express-validator');
const { TFCCLeaderModel } = require('../models/tfccLeader');
const { getSequelizeDateFilters } = require('../../../functions/filters');
const {
  getResponseVariables,
  paginate,
} = require('../../../functions/pagination');

const Controller = () => {
  const GetAllLeaders = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page } = req.query;

      // find all leaders
      const leadersData = await TFCCLeaderModel.findAndCountAll({
        order: [['id', 'ASC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All TFCC leaders retrieved',
        data: getResponseVariables(leadersData, limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewLeader = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find leader

      const leaderData = await TFCCLeaderModel.findByPk(id);

      if (!leaderData)
        return res.status(404).json({ message: 'Leader not found' });

      return res.status(200).json({
        message: 'TFCC leader retrieved successfully',
        leader: leaderData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddLeader = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { firstname, lastname, mobile, email, role } = req.body;

      const leaderData = await TFCCLeaderModel.create({
        firstname,
        lastname,
        mobile,
        email,
        role,
      });

      return res.status(200).json({
        message: 'TFCC leader added',
        leader: leaderData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateLeader = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { firstname, lastname, mobile, email, role } = req.body;

      const { id } = req.params;

      // Check if Leader exists
      const existingLeader = await TFCCLeaderModel.findByPk(id);

      if (!existingLeader)
        return res.status(404).json({ message: 'Leader not found' });

      existingLeader.firstname = firstname;
      existingLeader.lastname = lastname;
      existingLeader.mobile = mobile;
      existingLeader.email = email;
      existingLeader.role = role;

      await existingLeader.save();

      return res.status(200).json({
        message: 'TFCC leader updated successfully',
        leader: existingLeader,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteLeader = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find leader

      const leaderData = await TFCCLeaderModel.findByPk(id);

      if (!leaderData)
        return res.status(404).json({ message: 'Leader not found' });

      await TFCCLeaderModel.destroy({ where: { id } });

      return res.status(200).json({
        message: 'TFCC leader deleted successfully',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllLeaders,
    AddLeader,
    ViewLeader,
    UpdateLeader,
    DeleteLeader,
  };
};

module.exports = Controller;
