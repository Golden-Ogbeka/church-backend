const { getPaginationOptions } = require('./../../../utils/pagination');
const { validationResult } = require('express-validator');
const TestimonyModel = require('../models/testimony.model');
const { getDateFilters } = require('../../../functions/filters');

const Controller = () => {
  const GetAllTestimonies = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const paginationOptions = getPaginationOptions(req);

      const { status } = req.body;

      // find all testimonies

      const testimoniesData = status
        ? await TestimonyModel.paginate(
            { ...getDateFilters(req), status },
            paginationOptions
          )
        : await TestimonyModel.paginate(getDateFilters(req), paginationOptions);

      return res.status(200).json({
        message: 'All Testimonies Retrieved',
        data: testimoniesData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // const GetTestimonyByStatus = async (
  //   req<
  //     never,
  //     never,
  //     never,
  //     { page; limit; from; to; status }
  //   >,
  //   res
  // ) => {
  //   try {
  //     // check for validation errors
  //     const errors = validationResult(req)
  //     if (!errors.isEmpty())
  //       return res.status(422).json({ errors: errors.array() })

  //     const { page = 1, limit = 10, status } = req.query

  //     const testimonies = await TestimonyModel.find({
  //       status,
  //     })
  //       .limit(limit * 1)
  //       .skip((page - 1) * limit)
  //       .exec()

  //     const count = await TestimonyModel.find({ status }).count()

  //     return res.status(200).json({
  //       message: `All ${status} testimonies retrieved`,
  //       data: testimonies,
  //       totalPages: Math.ceil(count / limit),
  //       curentPage: page,
  //     })
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Internal Server Error' })
  //   }
  // }

  const ViewTestimony = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find testimony

      const testimonyData = await TestimonyModel.findById(id);

      if (!testimonyData)
        return res.status(404).json({ message: 'Testimony not found' });

      return res.status(200).json({
        message: 'Testimony retrieved successfully',
        testimony: testimonyData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const AddTestimony = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, content, fullName, summary, source, phoneNumber } =
        req.body;

      const testimonyData = new TestimonyModel({
        fullName,
        content,
        summary,
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
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  const ChangeStatus = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      const existingTestimony = await TestimonyModel.findById(id);
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
      console.log(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const GetApprovedTestimonies = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const paginationOptions = getPaginationOptions(req);

      // find all approved testimonies

      const testimoniesData = await TestimonyModel.paginate(
        { ...getDateFilters(req), status: 'approved' },
        paginationOptions
      );
      return res.status(200).json({
        message: 'Testimonies Retrieved',
        data: testimoniesData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
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
