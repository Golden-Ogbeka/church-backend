const { validationResult } = require('express-validator');
// const { getTodaysDate } =  require('../../../functions/date');
const { UserModel } = require('../models/user');
const { FeedbackModel } = require('../models/feedback');
const { EventModel } = require('../models/event');
const { Op } = require('sequelize');
const { AnnouncementModel } = require('../models/announcement');
const { TestimonyModel } = require('../models/testimony');
const { AdminModel } = require('../models/admin');
const { DevotionalModel } = require('../models/devotional');

const Controller = () => {
  const GetSummary = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      // Get today's date
      // const todaysDate = getTodaysDate();

      const totalUsers = await UserModel.findAll();
      const unreadFeedback = await FeedbackModel.findAll({
        where: { status: 'unread' },
      });
      const upcomingEvents = await EventModel.findAll({
        where: {
          // date: { [Op.gte]: todaysDate },
          date: { [Op.gte]: new Date() },
        },
      });

      const totalAnnouncements = await AnnouncementModel.findAll();
      const pendingTestimonies = await TestimonyModel.findAll({
        where: { status: 'pending' },
      });
      const totalAdmins = await AdminModel.findAll();
      const totalDevotionals = await DevotionalModel.findAll();

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
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetUserSummary = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const totalUsers = await UserModel.findAll();
      const userRegisteredByMobile = await UserModel.findAll({
        where: { registrationSource: 'mobile' },
      });
      const userRegisteredByWeb = await UserModel.findAll({
        where: { registrationSource: 'web' },
      });
      const registeredMembers = await UserModel.findAll({
        where: { member: true },
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
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetFeedbackSummary = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const totalFeedback = await FeedbackModel.findAll();
      const feedbackSentByMobile = await FeedbackModel.findAll({
        where: { source: 'mobile' },
      });
      const feedbackSentByWeb = await FeedbackModel.findAll({
        where: { source: 'web' },
      });
      const unreadFeedback = await FeedbackModel.findAll({
        where: { status: 'unread' },
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
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetTestimonySummary = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const totalTestimonies = await TestimonyModel.findAll();
      const testimonySentByMobile = await TestimonyModel.findAll({
        where: { source: 'mobile' },
      });
      const testimonySentByWeb = await TestimonyModel.findAll({
        where: { source: 'web' },
      });
      const pendingTestimonies = await TestimonyModel.findAll({
        where: { status: 'pending' },
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
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
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
