import { isValidAPI } from './../../../middlewares/shared';
import { Router } from 'express';
import { body, header } from 'express-validator';
import Controller from '../controllers/auth';

const router = Router();
const AuthController = Controller();

router.post(
  '/login',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('email', 'Failed! Email is required')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Failed! Password is required').exists(),
  ],
  AuthController.Login
);

router.post(
  '/register',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('email', 'Failed! Email is required')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Failed! Password is required').exists(),
    body('fullname', 'Failed! Full name is required').exists(),
  ],
  AuthController.Register
);

export default router;
