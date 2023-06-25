import { validationResult } from 'express-validator';
import express from 'express';
import { FeedbackModel, FeedbackModelAttributes } from '../models/feedback';
import { getSequelizeDateFilters } from '../../../functions/filters';
import { getResponseVariables, paginate } from '../../../functions/pagination';
import { getSQLUserDetails } from '../../../functions/auth';

export default () => {
  const GetAllFeedback = async (
    req: express.Request<
      never,
      never,
      { status?: string },
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

      const { status } = req.body;

      // find all feedback and filter by status if included

      const feedbackData = status
        ? await FeedbackModel.findAndCountAll({
            where: { status },
            order: [['createdAt', 'DESC']],
            ...getSequelizeDateFilters({ from, to }),
            ...paginate({ limit, page }),
          })
        : await FeedbackModel.findAndCountAll({
            order: [['createdAt', 'DESC']],
            ...getSequelizeDateFilters({ from, to }),
            ...paginate({ limit, page }),
          });

      return res.status(200).json({
        message: 'Feedback Retrieved',
        data: getResponseVariables(feedbackData, limit),
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const SendFeedback = async (
    req: express.Request<never, never, FeedbackModelAttributes>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { content, email, fullName, phoneNumber, source } = req.body;

      const newFeedback = await FeedbackModel.create({
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
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewFeedback = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find feedback

      const feedbackData = await FeedbackModel.findByPk(id);

      if (!feedbackData)
        return res.status(404).json({ message: 'Feedback not found' });

      return res.status(200).json({
        message: 'Feedback retrieved successfully',
        feedback: feedbackData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ChangeFeedbackStatus = async (
    req: express.Request<{ id: string }, never, FeedbackModelAttributes>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let { status } = req.body;

      const { id } = req.params;

      const userDetails = await getSQLUserDetails(req as any);

      // Check if Feedback exists for this date
      const existingFeedback = await FeedbackModel.findByPk(id);
      if (!existingFeedback)
        return res.status(404).json({ message: 'Feedback not found' });

      existingFeedback.status = status;
      existingFeedback.updatedBy = userDetails.fullname;

      await existingFeedback.save();

      return res.status(200).json({
        message: 'Feedback updated successfully',
        feedback: existingFeedback,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };
  return {
    GetAllFeedback,
    SendFeedback,
    ViewFeedback,
    ChangeFeedbackStatus,
  };
};
