import { isValidObjectId } from './../../../middlewares/shared';
import { isAdmin } from './../../../middlewares/auth';
import { isValidAPI } from '../../../middlewares/shared';
import { Router } from 'express';
import { body, header, param, query } from 'express-validator';
import { parser } from '../../../functions/cloudinary';

import Controller from '../controllers/event';

const router = Router();
const EventController = Controller();

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
  EventController.GetAllEvents
);

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
    parser.single('poster'),

    body('date', 'Date is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Date cannot be empty')
      .isISO8601()
      .toDate()
      .withMessage('Enter a valid date'),

    body('name', 'Name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    body('time', 'Time is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Time cannot be empty'),
    body('allowRegistration', 'Allow Registration is required')
      .exists()
      .isBoolean()
      .withMessage('Allow Registration must be boolean')
      .toBoolean(),
    body('limitedNumberRegistration', 'Limited Number Registration is required')
      .exists()
      .isBoolean()
      .withMessage('Allow Limited Number of Registration must be boolean')
      .toBoolean(),
    body('limitedDateRegistration', 'Limited Date  Registration is required')
      .exists()
      .isBoolean()
      .withMessage('Allow Limited Number of Registration must be boolean')
      .toBoolean(),
  ],
  EventController.AddEvent
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
    parser.single('poster'),

    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidObjectId(value)),
    body('date', 'Date is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Date cannot be empty')
      .isISO8601()
      .toDate()
      .withMessage('Enter a valid date'),

    body('name', 'Name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Name cannot be empty'),
    body('time', 'Time is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Time cannot be empty'),
    body('allowRegistration', 'Allow Registration is required')
      .exists()
      .isBoolean()
      .withMessage('Allow Registration must be boolean')
      .toBoolean(),
    body('limitedNumberRegistration', 'Limited Number Registration is required')
      .exists()
      .isBoolean()
      .withMessage('Allow Limited Number of Registration must be boolean')
      .toBoolean(),
    body('limitedDateRegistration', 'Limited Date  Registration is required')
      .exists()
      .isBoolean()
      .withMessage('Allow Limited Number of Registration must be boolean')
      .toBoolean(),
  ],
  EventController.UpdateEvent
)

// Get event by id
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
  EventController.ViewEvent
);

// Delete event by id
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
  EventController.DeleteEvent
);

//Register for event
router.post(
  '/:id/register',
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
  EventController.RegisterEvent
);
router.post(
  '/:id/upload',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
    parser.array('images'),
    body('images', 'Image is required').trim().exists().withMessage('Image is required'),
  ],
  EventController.UploadEventImages
);

export default router;
