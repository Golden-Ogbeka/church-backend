import { isValidObjectId, isValidSource } from './../../../middlewares/shared'
import { isAdmin } from './../../../middlewares/auth'
import { isValidAPI } from '../../../middlewares/shared'
import { Router } from 'express'
import { body, header, param } from 'express-validator'

import Controller from '../controllers/feedback'

const router = Router()
const FeedbackController = Controller()

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
  FeedbackController.GetAllFeedback
)

router.post(
  '/',
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
)

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
      .custom((value) => isValidObjectId(value)),
  ],
  FeedbackController.ViewFeedback
)

// Update feedback status
router.patch(
  '/status:id',
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
      .custom((value) => isValidObjectId(value)),

    body('status', 'Status is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Status cannot be empty')
      .isIn(['read', 'unread'])
      .withMessage('Status is either read or unread'),
  ],
  FeedbackController.ChangeFeedbackStatus
)

export default router
