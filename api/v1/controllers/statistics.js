const { validationResult } = require('express-validator');
const UserModel = require('../models/user.model');
const AdminModel = require('../models/admin.model');
const AnnouncementModel = require('../models/announcement.model');
const DevotionalModel = require('../models/devotional.model');
const EventModel = require('../models/event.model');
const FeedbackModel = require('../models/feedback.model');
const TestimonyModel = require('../models/testimony.model');
const { getTodaysDate } = require('../../../functions/date');

const Controller = () => {
  const GetSummary = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // Get today's date
      const todaysDate = getTodaysDate();

      const totalUsers = await UserModel.find();
      const unreadFeedback = await FeedbackModel.find({ status: 'unread' });
      const upcomingEvents = await EventModel.find({
        date: { $gte: todaysDate },
      });

      const totalAnnouncements = await AnnouncementModel.find();
      const pendingTestimonies = await TestimonyModel.find({
        status: 'pending',
      });
      const totalAdmins = await AdminModel.find();
      const totalDevotionals = await DevotionalModel.find();

      const generalSummary = {
        totalUsers: totalUsers.length,
        pendingTestimonies: pendingTestimonies.length,
        totalAdmins: totalAdmins.length,
        totalAnnouncements: totalAnnouncements.length,
        totalDevotionals: totalDevotionals.length,
        unreadFeedback: unreadFeedback.length,
        upcomingEvents: upcomingEvents.length,
      };

      return res.status(200).json({
        message: 'Summary Retrieved',
        data: generalSummary,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const GetUserSummary = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const totalUsers = await UserModel.find();
      const userRegisteredByMobile = await UserModel.find({
        registrationSource: 'mobile',
      });
      const userRegisteredByWeb = await UserModel.find({
        registrationSource: 'web',
      });
      const registeredMembers = await UserModel.find({
        member: true,
      });

      const userSummary = {
        totalUsers: totalUsers.length,
        userRegisteredByMobile: userRegisteredByMobile.length,
        userRegisteredByWeb: userRegisteredByWeb.length,
        registeredMembers: registeredMembers.length,
      };

      return res.status(200).json({
        message: 'Summary Retrieved',
        data: userSummary,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const GetFeedbackSummary = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const totalFeedback = await FeedbackModel.find();
      const feedbackSentByMobile = await FeedbackModel.find({
        source: 'mobile',
      });
      const feedbackSentByWeb = await FeedbackModel.find({
        source: 'web',
      });
      const unreadFeedback = await FeedbackModel.find({
        status: 'unread',
      });

      const feedbackSummary = {
        totalFeedback: totalFeedback.length,
        feedbackSentByMobile: feedbackSentByMobile.length,
        feedbackSentByWeb: feedbackSentByWeb.length,
        unreadFeedback: unreadFeedback.length,
      };

      return res.status(200).json({
        message: 'Summary Retrieved',
        data: feedbackSummary,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const GetTestimonySummary = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const totalTestimonies = await TestimonyModel.find();
      const testimonySentByMobile = await TestimonyModel.find({
        source: 'mobile',
      });
      const testimonySentByWeb = await TestimonyModel.find({
        source: 'web',
      });
      const pendingTestimonies = await TestimonyModel.find({
        status: 'pending',
      });

      const testimonySummary = {
        totalTestimonies: totalTestimonies.length,
        testimonySentByMobile: testimonySentByMobile.length,
        testimonySentByWeb: testimonySentByWeb.length,
        pendingTestimonies: pendingTestimonies.length,
      };

      return res.status(200).json({
        message: 'Summary Retrieved',
        data: testimonySummary,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    GetSummary,
    GetFeedbackSummary,
    GetTestimonySummary,
    GetUserSummary,
  };
};

module.exports = Controller;
