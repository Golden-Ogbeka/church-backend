const { isAdmin } = require('../middlewares/auth');
const { isValidAPI } = require('../middlewares/shared');
const { Router } = require('express');
const { header } = require('express-validator');
const Controller = require('../controllers/statistics');

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

module.exports = router;
