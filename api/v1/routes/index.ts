import express from 'express';
import AuthRoutes from './auth';
import DevotionalRoutes from './devotional';
import EventRoutes from './event';

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/devotional', DevotionalRoutes);
router.use('/event', EventRoutes);



export default router;
