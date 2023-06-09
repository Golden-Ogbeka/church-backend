import { isValidAPI, isValidID } from '../middlewares/shared';
import { Router } from 'express';
import { body, header, param, query } from 'express-validator';
import Controller from '../controllers/devotional';
import { isAdmin, isSuperAdmin } from '../middlewares/access';

const router = Router();
const DevotionalController = Controller();

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
  DevotionalController.GetAllDevotionals
);

router.get(
  '/user',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
  ],
  DevotionalController.GetDevotionalsForUser
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
    body('title', 'Title is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Title cannot be empty'),
    body('text', 'Text is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Text cannot be empty'),
    body('textReference', 'Text reference is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Text reference cannot be empty'),
    body('mainText', 'Main Text is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Main Text cannot be empty'),
    body('content', 'Content is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Content cannot be empty'),
    body('date', 'Date is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Date cannot be empty')
      .isISO8601()
      .toDate()
      .withMessage('Enter a valid date'),
  ],
  DevotionalController.AddDevotional
);

// Update devotional
router.patch(
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
    body('id', 'ID is required')
      .exists()
      .notEmpty()
      .withMessage('ID cannot be empty')
      .custom((value) => isValidID(value)),
    body('date', 'Date is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Date cannot be empty')
      .isISO8601()
      .toDate()
      .withMessage('Enter a valid date'),
    body('title', 'Title is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Title cannot be empty'),
    body('text', 'Text is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Text cannot be empty'),
    body('textReference', 'Text reference is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Text reference cannot be empty'),
    body('mainText', 'Main Text is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Main Text cannot be empty'),
    body('content', 'Content is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Content cannot be empty'),
  ],
  DevotionalController.UpdateDevotional
);

// Get devotional by id
router.get(
  '/view/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
  ],
  DevotionalController.ViewDevotional
);

// Get today's devotional
router.get(
  '/today',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
  ],
  DevotionalController.GetDayDevotional
);

// Delete devotional by id
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
  DevotionalController.DeleteDevotional
);

export default router;
