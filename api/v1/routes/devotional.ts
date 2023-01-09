import { isAdmin } from './../../../middlewares/auth';
import { isValidAPI } from '../../../middlewares/shared';
import { Router } from 'express';
import { body, header } from 'express-validator';
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

export default router;
