
import express from 'express';
import DevotionalRoutes from './devotional';
import EventRoutes from './event';
import AdminRoutes from './admin';
import TestimonyRoutes from './testimony';
import FeedbackRoutes from './feedback'
import UserRoutes from './user'
import AnnouncementRoutes from './announcement'

const router = express.Router()

router.use('/devotional', DevotionalRoutes)
router.use('/event', EventRoutes)
router.use('/admin', AdminRoutes)
router.use('/testimony', TestimonyRoutes)
router.use('/feedback', FeedbackRoutes)
router.use('/user', UserRoutes)
router.use('/announcement', AnnouncementRoutes)

export default router
