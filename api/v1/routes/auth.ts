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
    body('email', 'Email is required').trim()
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Password is required').trim().exists(),
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
    body('email', 'Email is required').trim()
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Password is required').trim().exists(),
    body('fullname', 'Full name is required').trim().exists(),
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
    body('email', 'Email is required').trim()
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
    body('email', 'Email is required').trim()
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('newPassword', 'New password is required').trim().exists().notEmpty().withMessage("New password cannot be empty"),
    body('verificationCode', 'Verification code is required').trim().exists(),

  ],
  AuthController.ResetPasswordUpdate
);

export default router;
