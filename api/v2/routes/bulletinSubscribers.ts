import { isAdmin, isSuperAdmin } from '../middlewares/access';
import { Router } from 'express';
import { body, header, param } from 'express-validator';
import Controller from '../controllers/bulletinSubscribers';
import { isValidAPI, isValidID } from '../middlewares/shared';

const router = Router();
const SubscriberController = Controller();

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
  SubscriberController.GetAllSubscribers
);

// Get unit by id
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
  SubscriberController.ViewSubscriber
);

router.post(
  '/new',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('address', 'Email address is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Email address cannot be empty'),
  ],
  SubscriberController.Subscribe
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
      .custom((value) => isSuperAdmin(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
    body('subscribed', 'Subscriber status is required')
      .exists()
      .isBoolean()
      .withMessage('Subscriber status must be boolean')
      .toBoolean(),
  ],
  SubscriberController.UpdateSubscriber
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
  SubscriberController.DeleteSubscriber
);

export default router;
