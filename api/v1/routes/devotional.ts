import { isValidObjectId } from './../../../middlewares/shared';
import { isAdmin } from './../../../middlewares/auth';
import { isValidAPI } from '../../../middlewares/shared';
import { Router } from 'express';
import { body, header, param, query } from 'express-validator';
import Controller from '../controllers/devotional';

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
    body('date', 'Date is required').trim().exists().notEmpty().withMessage("Date cannot be empty").isISO8601().toDate().withMessage("Enter a valid date"),
    body('title', 'Title is required').trim().exists().notEmpty().withMessage("Title cannot be empty"),
    body('text', 'Text is required').trim().exists().notEmpty().withMessage("Text cannot be empty"),
    body('mainText', 'Main Text is required').trim().exists().notEmpty().withMessage("Main Text cannot be empty"),
    body('content', 'Content is required').trim().exists().notEmpty().withMessage("Content cannot be empty"),
    body('confession', 'Confession is required').trim().exists().notEmpty().withMessage("Confession cannot be empty"),
    body('furtherReading', 'Further reading is required').exists().isArray({ min: 1 }).withMessage("Further reading must have at least one scripture"),
    body('oneYearBibleReading', 'One year bible reading is required').exists().isArray({ min: 1 }).withMessage("One year bible reading must have at least one scripture"),
    body('twoYearsBibleReading', 'Two years bible reading is required').exists().isArray({ min: 1 }).withMessage("Two years bible reading must have at least one scripture"),

  ],
  DevotionalController.AddDevotional
);

// Get devotional by id
router.get(
  '/view/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    param("id", "ID is required").exists().custom(value => isValidObjectId(value))
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

export default router;
