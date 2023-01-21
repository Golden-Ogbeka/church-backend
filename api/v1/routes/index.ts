import express from 'express';
import AuthRoutes from './auth';
import DevotionalRoutes from './devotional';
import EventRoutes from './event';
import AdminRoutes from './admin';

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/devotional', DevotionalRoutes);
router.use('/event', EventRoutes);
router.use('/admin', AdminRoutes);

export default router;
