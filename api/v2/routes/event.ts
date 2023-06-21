import { isValidAPI, isValidEventType, isValidID } from '../middlewares/shared';
import { Router } from 'express';
import { body, header, param, query } from 'express-validator';
import { parser } from '../../../functions/cloudinary';

import Controller from '../controllers/event';
import { isAdmin, isSuperAdmin } from '../middlewares/access';

const router = Router();
const EventController = Controller();

router.get(
  '/',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
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
    body('eventType', 'eventType is required')
      .trim()
      .exists()
      .custom((value) => isValidEventType(value)),
    body('description').trim().optional(),
  ],
  EventController.AddEvent
);

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
      .custom((value) => isValidID(value)),
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

    body('eventType', 'eventType is required')
      .trim()
      .exists()
      .custom((value) => isValidEventType(value)),
    body('description').trim().optional(),
  ],
  EventController.UpdateEvent
);

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
      .custom((value) => isValidID(value)),
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
      .custom((value) => isSuperAdmin(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
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
    // header('authorization', 'Please specify an authorization header')
    //   .exists()
    //   .bail()
    //   .custom((value) => isAdmin(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
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
    param('id', 'Event ID is required')
      .exists()
      .custom((value) => isValidID(value)),
    body('images', 'Image is required')
      .trim()
      .exists()
      .withMessage('Image is required'),
  ],
  EventController.UploadEventImages
);

// Delete gallery image
router.delete(
  '/gallery/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isSuperAdmin(value)),
    param('id', 'Event ID is required')
      .exists()
      .custom((value) => isValidID(value)),
    body('image_id', 'Image ID is required').exists().trim(),
  ],
  EventController.DeleteGalleryImage
);

export default router;
