const {
  isValidAPI,
  isValidID,
  isValidSource,
} = require('../middlewares/shared');
const { Router } = require('express');
const { body, header, param } = require('express-validator');

const Controller = require('../controllers/feedback');
const { isAdmin } = require('../middlewares/access');

const router = Router();
const FeedbackController = Controller();

router.post(
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
    body('status')
      .trim()
      .optional()
      .isIn(['read', 'unread'])
      .withMessage('Status is either read or unread'),
  ],
  FeedbackController.GetAllFeedback
);

router.post(
  '/new',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('fullName', 'Full name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Full name cannot be empty'),
    body('phoneNumber', 'Phone number is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Phone number cannot be empty'),
    body('email', 'Email is required')
      .trim()
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('content', 'Content is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Content cannot be empty'),
    body('source', 'source is required')
      .trim()
      .exists()
      .custom((value) => isValidSource(value)),
  ],
  FeedbackController.SendFeedback
);

// Get feedback by id
router.get(
  '/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
  ],
  FeedbackController.ViewFeedback
);

// Update feedback status
router.patch(
  '/status/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),

    body('status', 'Status is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Status cannot be empty')
      .isIn(['read', 'unread'])
      .withMessage('Status is either read or unread'),
  ],
  FeedbackController.ChangeFeedbackStatus
);

module.exports = router;
