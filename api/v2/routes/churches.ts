import { isAdmin, isSuperAdmin } from '../middlewares/access';
import { Router } from 'express';
import { body, header, param } from 'express-validator';
import Controller from '../controllers/churches';
import { isValidAPI, isValidID } from '../middlewares/shared';

const router = Router();
const ChurchController = Controller();

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
  ChurchController.GetAllChurches
);

// Get church by id
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
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
  ],
  ChurchController.ViewChurch
);

router.post(
  '/',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('church_label', 'Church label is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Church label cannot be empty'),
    body('location', 'Church location is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Church location cannot be empty'),
    body('address', 'Church address is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Church address cannot be empty'),
    body('contact_phone', 'Church address is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Church address cannot be empty'),
    body('contact_email', 'Church email is required').trim().optional(),
  ],
  ChurchController.AddChurch
);

router.put(
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
    body('church_label', 'Church label is required').trim().optional(),
    body('location', 'Church location is required').trim().optional(),
    body('address', 'Church address is required').trim().optional(),
    body('contact_phone', 'Church address is required').trim().optional(),
    body('contact_email', 'Church email is required').trim().optional(),
  ],
  ChurchController.UpdateChurch
);

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
  ChurchController.DeleteChurch
);

export default router;
