import express from 'express';
import AuthRoutes from './auth'
import DevotionalRoutes from './devotional'

const router = express.Router();

router.use('/auth', AuthRoutes);
router.use('/devotional', DevotionalRoutes);


export default router;
