const { getUserDetails } = require('./../../../functions/auth');
const { getPaginationOptions } = require('./../../../utils/pagination');
const { validationResult } = require('express-validator');
const FeedbackModel = require('../models/feedback.model');
const { getDateFilters } = require('../../../functions/filters');

const Controller = () => {
  const GetAllFeedback = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const paginationOptions = getPaginationOptions(req);

      const { status } = req.body;

      // find all feedback and filter by status if included

      const feedbackData = status
        ? await FeedbackModel.paginate(
            { ...getDateFilters(req), status },
            paginationOptions
          )
        : await FeedbackModel.paginate(getDateFilters(req), paginationOptions);

      return res.status(200).json({
        message: 'Feedback Retrieved',
        data: feedbackData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const SendFeedback = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { content, email, fullName, phoneNumber, source } = req.body;

      const newFeedback = new FeedbackModel({
        content,
        email,
        fullName,
        phoneNumber,
        source,
      });

      await newFeedback.save();

      return res.status(200).json({
        message: 'Feedback sent successfully',
        feedback: newFeedback,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ViewFeedback = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find feedback

      const feedbackData = await FeedbackModel.findById(id);

      if (!feedbackData)
        return res.status(404).json({ message: 'Feedback not found' });

      return res.status(200).json({
        message: 'Feedback retrieved successfully',
        feedback: feedbackData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const GetFeedbackByStatus = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { status } = req.params;
      const paginationOptions = getPaginationOptions(req);

      // find feedback

      const feedback = await FeedbackModel.paginate(
        { status },
        paginationOptions
      );

      return res.status(200).json({
        message: 'Feedback retrieved successfully',
        data: feedback,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ChangeFeedbackStatus = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { status } = req.body;

      const { id } = req.params;

      const userDetails = await getUserDetails(req);

      // Check if Feedback exists for this date
      const existingFeedback = await FeedbackModel.findById(id);
      if (!existingFeedback)
        return res.status(404).json({ message: 'Feedback not found' });

      existingFeedback.status = status;
      existingFeedback.updatedBy = userDetails.fullname;

      await existingFeedback.save();

      return res.status(200).json({
        message: 'Feedback updated successfully',
        feedback: existingFeedback,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  return {
    GetAllFeedback,
    SendFeedback,
    ViewFeedback,
    ChangeFeedbackStatus,
    GetFeedbackByStatus,
  };
};

module.exports = Controller;
