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
    body('email', 'Email is required')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Password is required').exists(),
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
    body('email', 'Email is required')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Password is required').exists(),
    body('fullname', 'Full name is required').exists(),
  ],
  AuthController.Register
);

router.post(
  '/reset-password',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('email', 'Email is required')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),

  ],
  AuthController.ResetPasswordRequest
);

router.post(
  '/reset-password/update',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('email', 'Email is required')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('newPassword', 'New password is required').exists(),
    body('verificationCode', 'Verification code is required').exists(),

  ],
  AuthController.ResetPasswordUpdate
);

export default router;
