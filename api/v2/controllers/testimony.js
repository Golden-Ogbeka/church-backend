const { validationResult } = require('express-validator');
const { getSequelizeDateFilters } = require('../../../functions/filters');
const { TestimonyModel } = require('../models/testimony');
const {
  getResponseVariables,
  paginate,
} = require('../../../functions/pagination');

const Controller = () => {
  const GetAllTestimonies = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page } = req.query;

      const { status } = req.body;

      // find all testimonies

      const testimoniesData = status
        ? await TestimonyModel.findAndCountAll({
            where: { status },
            order: [['ditto', 'DESC']],
            ...getSequelizeDateFilters({ from, to }),
            ...paginate({ limit, page }),
          })
        : await TestimonyModel.findAndCountAll({
            order: [['ditto', 'DESC']],
            ...getSequelizeDateFilters({ from, to }),
            ...paginate({ limit, page }),
          });

      return res.status(200).json({
        message: 'All Testimonies Retrieved',
        data: getResponseVariables(testimoniesData, limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewTestimony = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find testimony

      const testimonyData = await TestimonyModel.findByPk(id);

      if (!testimonyData)
        return res.status(404).json({ message: 'Testimony not found' });

      return res.status(200).json({
        message: 'Testimony retrieved successfully',
        testimony: testimonyData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddTestimony = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, content, fullName, summary, source, phoneNumber } =
        req.body;

      const testimonyData = await TestimonyModel.create({
        names: fullName,
        main_gist: content,
        titles: summary,
        source,
        email,
        phoneNumber,
      });
      await testimonyData.save();

      return res.status(200).json({
        message: 'Testimony sent',
        testimony: testimonyData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };
  const ChangeStatus = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      const existingTestimony = await TestimonyModel.findByPk(id);
      if (!existingTestimony)
        return res.status(404).json({ message: 'Testimony not found' });

      let { status } = req.body;

      existingTestimony.status = status;
      await existingTestimony.save();
      return res.status(200).json({
        message: 'Testimony status updated successfully',
        testimony: existingTestimony,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  // This is the one users call
  const GetApprovedTestimonies = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page } = req.query;

      // find all approved testimonies

      const testimoniesData = await TestimonyModel.findAndCountAll({
        where: { status: 'approved' },
        order: [['ditto', 'DESC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });
      return res.status(200).json({
        message: 'Testimonies Retrieved',
        data: getResponseVariables(testimoniesData, limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllTestimonies,
    AddTestimony,
    ChangeStatus,
    ViewTestimony,
    GetApprovedTestimonies,
  };
};

module.exports = Controller;
