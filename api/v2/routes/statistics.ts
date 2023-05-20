import { isAdmin } from '../../v1/middlewares/auth';
import { isValidAPI } from '../middlewares/shared';
import { Router } from 'express';
import { header } from 'express-validator';
import Controller from '../controllers/statistics';

const router = Router();
const StatisticController = Controller();

router.get(
  '/',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
  ],
  StatisticController.GetSummary
);

router.get(
  '/user',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
  ],
  StatisticController.GetUserSummary
);

router.get(
  '/feedback',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
  ],
  StatisticController.GetFeedbackSummary
);

router.get(
  '/testimony',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
  ],
  StatisticController.GetTestimonySummary
);

export default router;
