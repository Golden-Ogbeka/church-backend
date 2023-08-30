const express = require('express');
const DevotionalRoutes = require('./devotional');
const EventRoutes = require('./event');
const AdminRoutes = require('./admin');
const TestimonyRoutes = require('./testimony');
const FeedbackRoutes = require('./feedback');
const UserRoutes = require('./user');
const AnnouncementRoutes = require('./announcement');
const StatisticsRoutes = require('./statistics');
const TFCCRoutes = require('./tfcc');
const TFCCZoneRoutes = require('./tfccZone');

const router = express.Router();

router.use('/devotional', DevotionalRoutes);
router.use('/event', EventRoutes);
router.use('/admin', AdminRoutes);
router.use('/testimony', TestimonyRoutes);
router.use('/feedback', FeedbackRoutes);
router.use('/user', UserRoutes);
router.use('/announcement', AnnouncementRoutes);
router.use('/statistics', StatisticsRoutes);
router.use('/tfcc', TFCCRoutes);
router.use('/tfcc/zone', TFCCZoneRoutes);

module.exports = router;
