import { isValidObjectId } from './../../../middlewares/shared'
import { isAdmin } from './../../../middlewares/auth'
import { isValidAPI } from '../../../middlewares/shared'
import { Router } from 'express'
import { body, header, param, query } from 'express-validator'
import { parser } from '../../../functions/cloudinary'

import Controller from '../controllers/announcement'

const router = Router()
const AnnouncementController = Controller()

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
  AnnouncementController.GetAllAnnouncements
)

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
    parser.single('image'),
    body('title', 'Title is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Title cannot be empty'),
    body('priority', 'Priority is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Priority cannot be empty')
      .toInt(),
    body('details').trim().optional(),
  ],
  AnnouncementController.AddAnnouncement
)

router.patch(
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
    parser.single('image'),

    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidObjectId(value)),
    body('title', 'Title is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Title cannot be empty'),
    body('priority', 'Priority is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Priority cannot be empty')
      .toInt(),
    body('details')
      .trim()
      .optional()

  ],
  AnnouncementController.UpdateAnnouncement
)

// Get announcement by id
router.get(
  '/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidObjectId(value)),
  ],
  AnnouncementController.ViewAnnouncement
)

// Delete announcement by id
router.delete(
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
  AnnouncementController.DeleteAnnouncement
)

export default router
