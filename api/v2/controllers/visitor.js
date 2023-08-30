const { validationResult } = require('express-validator');
const { VisitorModel } = require('../models/visitor');
const { getSequelizeDateFilters } = require('../../../functions/filters');
const {
  getResponseVariables,
  paginate,
} = require('../../../functions/pagination');

const Controller = () => {
  const GetAllVisitors = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page } = req.query;

      // find all visitors
      const visitorsData = await VisitorModel.findAndCountAll({
        order: [['id', 'DESC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All visitors retrieved',
        data: getResponseVariables(visitorsData, limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetAllVisitorsByFilter = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page, timerValue, assigned } = req.query;

      // find all visitors
      const visitorsData = await VisitorModel.findAndCountAll({
        where: {
          ...(timerValue
            ? {
                timer2: timerValue === 'first' ? true : false, //first timers
                timer21: timerValue === 'second' ? true : false, // second timers
              }
            : {}),
          ...(assigned
            ? {
                assigned,
              }
            : {}),
        },
        order: [['id', 'DESC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All visitors retrieved',
        data: getResponseVariables(visitorsData, limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewVisitor = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find visitor

      const visitorData = await VisitorModel.findByPk(id);

      if (!visitorData)
        return res.status(404).json({ message: 'Visitor not found' });

      return res.status(200).json({
        message: 'Visitor retrieved successfully',
        visitor: visitorData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddVisitor = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const {
        fname,
        lname,
        address,
        nearest,
        marital,
        gender,
        phone,
        email,
        contact_mode,
        service_opinion,
        suggestions,
        membership,
        dated,
        timerValue,
        category,
      } = req.body;

      const visitorData = await VisitorModel.create({
        fname,
        lname,
        address,
        nearest,
        marital,
        gender,
        phone,
        email,
        contact_mode,
        service_opinion,
        suggestions,
        membership,
        dated,
        assigned: false,
        timer2: timerValue === 'first' ? true : false,
        timer21: timerValue === 'second' ? true : false,
        category,
      });

      return res.status(200).json({
        message: 'Visitor added',
        visitor: visitorData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateVisitor = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let {
        fname,
        lname,
        address,
        nearest,
        marital,
        gender,
        phone,
        email,
        contact_mode,
        service_opinion,
        suggestions,
        membership,
        dated,
        timerValue,
        category,
        assigned,
      } = req.body;

      const { id } = req.params;

      // Check if Visitor exists
      const existingVisitor = await VisitorModel.findByPk(id);

      if (!existingVisitor)
        return res.status(404).json({ message: 'Visitor not found' });

      existingVisitor.fname = fname;
      existingVisitor.lname = lname;
      existingVisitor.address = address;
      existingVisitor.phone = phone;
      existingVisitor.email = email;
      existingVisitor.dated = dated;
      existingVisitor.nearest = nearest;
      existingVisitor.marital = marital;
      existingVisitor.gender = gender;
      existingVisitor.contact_mode = contact_mode;
      existingVisitor.service_opinion = service_opinion;
      existingVisitor.suggestions = suggestions;
      existingVisitor.membership = membership;
      existingVisitor.category = category;
      existingVisitor.assigned = assigned ? assigned : false;
      existingVisitor.timer2 = timerValue === 'first' ? true : false;
      existingVisitor.timer21 = timerValue === 'second' ? true : false;

      await existingVisitor.save();

      return res.status(200).json({
        message: 'Visitor updated successfully',
        visitor: existingVisitor,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteVisitor = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find visitor

      const visitorData = await VisitorModel.findByPk(id);

      if (!visitorData)
        return res.status(404).json({ message: 'Visitor not found' });

      await VisitorModel.destroy({ where: { id } });

      return res.status(200).json({
        message: 'Visitor deleted successfully',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllVisitors,
    AddVisitor,
    ViewVisitor,
    UpdateVisitor,
    DeleteVisitor,
    GetAllVisitorsByFilter,
  };
};

module.exports = Controller;
