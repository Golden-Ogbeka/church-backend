import { Router } from 'express';
import { body, header } from 'express-validator';
import Controller from '../controllers/auth';

const router = Router();
const AdminController = Controller();

router.post(
  '/login',
  [
    body('email', 'Failed! Email cant be blank')
      .exists()
      .bail()
      .isEmail()
      .withMessage('Invalid Email format'),
    body('password', 'Failed! Password cant be blank').exists(),
  ],
  AdminController.Login
);

export default router;
