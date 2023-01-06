import { Router } from 'express';
import { body, header } from 'express-validator';
import Controller from '../controllers/auth';

const router = Router();
const AdminController = Controller();

router.post(
  '/login',
  [
    body('email', 'Failed! Email is required')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Failed! Password is required').exists(),
  ],
  AdminController.Login
);

router.post(
  '/register',
  [
    body('email', 'Failed! Email is required')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Failed! Password is required').exists(),
    body('fullname', 'Failed! Full name is required').exists(),
  ],
  AdminController.Register
);

export default router;
