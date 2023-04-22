import {
  FeedbackSummaryType,
  GeneralSummaryType,
  TestimonySummaryType,
  UserSummaryType,
} from './../../../types/statistics'
import { getPaginationOptions } from '../../../utils/pagination'
import { validationResult } from 'express-validator'
import express from 'express'
import UserModel from '../../../models/user.model'
import AdminModel from '../../../models/admin.model'
import AnnouncementModel from '../../../models/announcement.model'
import DevotionalModel from '../../../models/devotional.model'
import EventModel from '../../../models/event.model'
import FeedbackModel from '../../../models/feedback.model'
import TestimonyModel from '../../../models/testimony.model'
import { getDateFilters } from '../../../functions/filters'
import { getTodaysDate } from '../../../functions/date'

export default () => {
  const GetSummary = async (req: express.Request, res: express.Response) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      // Get today's date
      const todaysDate = getTodaysDate()

      const totalUsers = await UserModel.find()
      const unreadFeedback = await FeedbackModel.find({ status: 'unread' })
      const upcomingEvents = await EventModel.find({
        date: { $gte: todaysDate },
      })

      const totalAnnouncements = await AnnouncementModel.find()
      const pendingTestimonies = await TestimonyModel.find({
        status: 'pending',
      })
      const totalAdmins = await AdminModel.find()
      const totalDevotionals = await DevotionalModel.find()

      const generalSummary: GeneralSummaryType = {
        totalUsers: totalUsers.length,
        pendingTestimonies: pendingTestimonies.length,
        totalAdmins: totalAdmins.length,
        totalAnnouncements: totalAnnouncements.length,
        totalDevotionals: totalDevotionals.length,
        unreadFeedback: unreadFeedback.length,
        upcomingEvents: upcomingEvents.length,
      }

      return res.status(200).json({
        message: 'Summary Retrieved',
        data: generalSummary,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const GetUserSummary = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const totalUsers = await UserModel.find()
      const userRegisteredByMobile = await UserModel.find({
        registrationSource: 'mobile',
      })
      const userRegisteredByWeb = await UserModel.find({
        registrationSource: 'web',
      })
      const registeredMembers = await UserModel.find({
        member: true,
      })

      const userSummary: UserSummaryType = {
        totalUsers: totalUsers.length,
        userRegisteredByMobile: userRegisteredByMobile.length,
        userRegisteredByWeb: userRegisteredByWeb.length,
        registeredMembers: registeredMembers.length,
      }

      return res.status(200).json({
        message: 'Summary Retrieved',
        data: userSummary,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const GetFeedbackSummary = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const totalFeedback = await FeedbackModel.find()
      const feedbackSentByMobile = await FeedbackModel.find({
        source: 'mobile',
      })
      const feedbackSentByWeb = await FeedbackModel.find({
        source: 'web',
      })
      const unreadFeedback = await FeedbackModel.find({
        status: 'unread',
      })

      const feedbackSummary: FeedbackSummaryType = {
        totalFeedback: totalFeedback.length,
        feedbackSentByMobile: feedbackSentByMobile.length,
        feedbackSentByWeb: feedbackSentByWeb.length,
        unreadFeedback: unreadFeedback.length,
      }

      return res.status(200).json({
        message: 'Summary Retrieved',
        data: feedbackSummary,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const GetTestimonySummary = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const totalTestimonies = await TestimonyModel.find()
      const testimonySentByMobile = await TestimonyModel.find({
        source: 'mobile',
      })
      const testimonySentByWeb = await TestimonyModel.find({
        source: 'web',
      })
      const pendingTestimonies = await TestimonyModel.find({
        status: 'pending',
      })

      const testimonySummary: TestimonySummaryType = {
        totalTestimonies: totalTestimonies.length,
        testimonySentByMobile: testimonySentByMobile.length,
        testimonySentByWeb: testimonySentByWeb.length,
        pendingTestimonies: pendingTestimonies.length,
      }

      return res.status(200).json({
        message: 'Summary Retrieved',
        data: testimonySummary,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  return {
    GetSummary,
    GetFeedbackSummary,
    GetTestimonySummary,
    GetUserSummary,
  }
}
