import { getUserDetails } from './../../../functions/auth'
import { FeedbackType, RegistrationDetailType } from './../../../types/index'
import { getPaginationOptions } from './../../../utils/pagination'
import { validationResult } from 'express-validator'
import express from 'express'
import FeedbackModel, { IFeedback } from '../../../models/feedback.model'
import { getDateFilters } from '../../../functions/filters'

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
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const paginationOptions = getPaginationOptions(req as any)

      const { status } = req.body

      // find all feedback and filter by status if included

      const feedbackData = status
        ? await FeedbackModel.paginate(
            { ...getDateFilters(req as any), status },
            paginationOptions
          )
        : await FeedbackModel.paginate(
            getDateFilters(req as any),
            paginationOptions
          )

      return res.status(200).json({
        message: 'Feedback Retrieved',
        data: feedbackData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const SendFeedback = async (
    req: express.Request<never, never, FeedbackType>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      let { content, email, fullName, phoneNumber, source } = req.body

      const newFeedback = new FeedbackModel({
        content,
        email,
        fullName,
        phoneNumber,
        source,
      })

      await newFeedback.save()

      return res.status(200).json({
        message: 'Feedback sent successfully',
        feedback: newFeedback,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const ViewFeedback = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find feedback

      const feedbackData = await FeedbackModel.findById(id)

      if (!feedbackData)
        return res.status(404).json({ message: 'Feedback not found' })

      return res.status(200).json({
        message: 'Feedback retrieved successfully',
        feedback: feedbackData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const GetFeedbackByStatus = async (
    req: express.Request<
      { status: string },
      never,
      never,
      { page: number; limit: number; from: string; to: string }
    >,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { status } = req.params
      const paginationOptions = getPaginationOptions(req as any)

      // find feedback

      const feedback = await FeedbackModel.paginate(
        { status },
        paginationOptions
      )

      return res.status(200).json({
        message: 'Feedback retrieved successfully',
        data: feedback,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const ChangeFeedbackStatus = async (
    req: express.Request<{ id: string }, never, FeedbackType>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      let { status } = req.body

      const { id } = req.params

      const userDetails = await getUserDetails(req as any)

      // Check if Feedback exists for this date
      const existingFeedback = await FeedbackModel.findById(id)
      if (!existingFeedback)
        return res.status(404).json({ message: 'Feedback not found' })

      existingFeedback.status = status
      existingFeedback.updatedBy = userDetails.fullname

      await existingFeedback.save()

      return res.status(200).json({
        message: 'Feedback updated successfully',
        feedback: existingFeedback,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  return {
    GetAllFeedback,
    SendFeedback,
    ViewFeedback,
    ChangeFeedbackStatus,
    GetFeedbackByStatus,
  }
}
