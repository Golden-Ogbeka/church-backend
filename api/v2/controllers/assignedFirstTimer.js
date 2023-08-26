const { AssignedFirstTimerModel } = require('./../models/assignedFirstTimer');
const { TFCCLeaderModel } = require('./../models/tfccLeader');
const { validationResult } = require('express-validator');
const { VisitorModel } = require('../models/visitor');
const { getSequelizeDateFilters } = require('../../../functions/filters');
const {
  getResponseVariables,
  paginate,
} = require('../../../functions/pagination');
const { Op } = require('sequelize');

const Controller = () => {
  const GetAllAssignedFirstTimers = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page } = req.query;

      // find all assignments
      const assignmentsData = await AssignedFirstTimerModel.findAndCountAll({
        order: [['id', 'DESC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All assignments retrieved',
        data: getResponseVariables(assignmentsData, limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetAssignedFirstTimersByStatus = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page } = req.query;

      const { status } = req.params;

      // find all assignments
      const assignmentsData = await AssignedFirstTimerModel.findAndCountAll({
        where: { status },
        include: [VisitorModel, TFCCLeaderModel],
        order: [['id', 'DESC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All assignments retrieved',
        data: getResponseVariables(assignmentsData, limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetAssignedFirstTimer = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find all assignments
      const assignmentsData = await AssignedFirstTimerModel.findOne({
        where: { id },
        include: [VisitorModel, TFCCLeaderModel],
      });

      return res.status(200).json({
        message: 'Assignment retrieved',
        data: assignmentsData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetAssignedFirstTimerForLeader = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { leader_id, leader_name } = req.query;

      if (!leader_id && !leader_name) {
        return res
          .status(400)
          .json({ message: 'Please specify the TFCC Leader' });
      }

      // find all assignments
      const assignmentsData = await AssignedFirstTimerModel.findAll({
        where: {
          [Op.or]: [
            ...(leader_id ? [{ assigned_id: leader_id }] : []),
            ...(leader_name ? [{ assigned: leader_name }] : []),
          ],
        },
        include: [VisitorModel],
      });

      return res.status(200).json({
        message: 'Assignments retrieved',
        data: assignmentsData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AssignFirstTimer = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { leader_id, visitor_id } = req.body;

      // find leader
      const leaderData = await TFCCLeaderModel.findOne({
        where: { id: leader_id },
      });

      if (!leaderData)
        return res.status(404).json({ message: 'Invalid TFCC leader' });

      // find visitor
      const visitorData = await VisitorModel.findOne({
        where: { id: visitor_id },
      });

      if (!visitorData)
        return res
          .status(404)
          .json({ message: 'Assigned first timer not found' });

      // find existing assignment
      const foundAssignment = await AssignedFirstTimerModel.findOne({
        where: { v_id: visitorData.id },
      });

      if (foundAssignment)
        return res
          .status(404)
          .json({ message: 'Assigned first timer is already assigned' });

      const newAssignment = await AssignedFirstTimerModel.create({
        v_id: visitor_id,
        names: visitorData.fname + ' ' + visitorData.lname,
        address: visitorData.address,
        gender: visitorData.gender,
        phone: visitorData.phone,
        ditto: visitorData.createdAt,
        nearest: visitorData.nearest,
        assigned: leaderData.firstname + ' ' + leaderData.lastname,
        assigned_id: leaderData.id,
        assigned_p: leaderData.mobile,
      });

      newAssignment.case_id = `TFCC/${new Date().getFullYear()}/${(
        new Date().getMonth() + 1
      ) // it comes in 0 to 11
        .toLocaleString('en-US', {
          minimumIntegerDigits: 2, // to make it 2 digits
          useGrouping: false,
        })}/${newAssignment.id}`;

      await newAssignment.save();

      // Update visitor
      visitorData.assigned = true;
      await visitorData.save();

      return res.status(200).json({
        message: 'First timer assigned',
        data: newAssignment,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateAssignedFirstTimer = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;
      const { status, response } = req.body;

      // find all assignments
      const assignmentsData = await AssignedFirstTimerModel.findOne({
        where: { id },
      });

      if (!assignmentsData)
        return res.status(404).json({ message: 'Assignment not found' });

      assignmentsData.status = status || assignmentsData.status;
      assignmentsData.response = response || assignmentsData.response;

      await assignmentsData.save();

      return res.status(200).json({
        message: 'Assignment Updated',
        data: assignmentsData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteAssignedFirstTimer = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find assignedFirstTimer

      const assignedFirstTimerData = await AssignedFirstTimerModel.findByPk(id);

      if (!assignedFirstTimerData)
        return res
          .status(404)
          .json({ message: 'Assigned first timer not found' });

      await AssignedFirstTimerModel.destroy({ where: { id } });

      return res.status(200).json({
        message: 'Assigned first timer deleted successfully',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllAssignedFirstTimers,
    GetAssignedFirstTimersByStatus,
    UpdateAssignedFirstTimer,
    GetAssignedFirstTimer,
    AssignFirstTimer,
    DeleteAssignedFirstTimer,
    GetAssignedFirstTimerForLeader,
  };
};

module.exports = Controller;
