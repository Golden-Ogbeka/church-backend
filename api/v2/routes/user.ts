import { isAdmin, isSuperAdmin } from '../middlewares/access';
import { Router } from 'express';
import { body, header, param, query } from 'express-validator';
import Controller from '../controllers/user';
import { isValidAPI, isValidID, isValidSource } from '../middlewares/shared';
import { isValidUser } from '../middlewares/access';

const router = Router();
const UserController = Controller();

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
      .custom((value) => isSuperAdmin(value)),
  ],
  UserController.GetAllUsers
);

// Get user by id
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
      .custom((value) => isSuperAdmin(value)),
  ],
  UserController.ViewUser
);

router.post(
  '/login',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('email', 'Email is required')
      .trim()
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage('Invalid Email format'),
    body('password', 'Password is required').trim().exists(),
  ],
  UserController.Login
);

router.post(
  '/reset-password',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('email', 'Email is required')
      .trim()
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage('Invalid Email format'),
  ],
  UserController.ResetPasswordRequest
);

router.post(
  '/reset-password/update',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('email', 'Email is required')
      .trim()
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage('Invalid Email format'),
    body('newPassword', 'New password is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('New password cannot be empty'),
    body('verificationCode', 'Verification code is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Verification code cannot be empty'),
  ],
  UserController.ResetPasswordUpdate
);

router.post(
  '/register',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('email', 'Email is required')
      .trim()
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage('Invalid Email format'),
    body('password', 'Password is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Password cannot be empty'),
    body('phone', 'Phone number is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Phone number cannot be empty'),
    body('fname', 'First name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lname', 'Last name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Last name cannot be empty'),
    body('dob', 'Date of birth is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Date of birth cannot be empty')
      .isISO8601()
      .toDate()
      .withMessage('Enter a valid date'),
    body('churchCenter', 'Church center is required').trim().optional(),
    body('member', 'Member status is required')
      .exists()
      .isBoolean()
      .withMessage('Member status must be boolean')
      .toBoolean(),
    body('registrationSource', 'Registration source is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Registration source cannot be empty')
      .custom((value) => isValidSource(value)),
    body('titles', 'Title is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Title cannot be empty'),
    body('address', 'Address is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Address cannot be empty'),
    body('gender', 'Gender is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Gender cannot be empty')
      .isIn(['Male', 'Female'])
      .withMessage('Gender is either Male or Female'),
    body('marital', 'Marital status is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Marital status cannot be empty')
      .isIn(['Married', 'Single', 'Widowed', 'Divorced', 'Engaged'])
      .withMessage(
        'Marital status is either Married, Single, Widowed, Engaged or Divorced'
      ),
  ],
  UserController.Register
);

// Get user profile by user
router.get(
  '/profile',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isValidUser(value)),
  ],
  UserController.GetUserProfile
);

// Change password by user
router.put(
  '/change-password',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isValidUser(value)),
    body('oldPassword', 'Old password is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Old password cannot be empty'),
    body('newPassword', 'New password is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('New password cannot be empty'),
  ],
  UserController.ChangeUserPassword
);

router.put(
  '/profile',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isValidUser(value)),
    body('phone').trim().optional(),
    body('fname').trim().optional(),
    body('lname', 'Last name is required').trim().optional(),
    body('dob', 'Date of birth is required')
      .trim()
      .optional()
      .isISO8601()
      .toDate()
      .withMessage('Enter a valid date'),
    body('churchCenter', 'Church center is required').trim().optional(),
    body('member', 'Member status is required')
      .optional()
      .isBoolean()
      .withMessage('Member status must be boolean')
      .toBoolean(),
    body('titles', 'Title is required').trim().optional(),
    body('address', 'Address is required').trim().optional(),
    body('gender', 'Gender is required')
      .trim()
      .optional()
      .isIn(['Male', 'Female'])
      .withMessage('Gender is either Male or Female'),
    body('marital', 'Marital status is required')
      .trim()
      .optional()
      .isIn(['Married', 'Single', 'Widowed', 'Divorced'])
      .withMessage('Gender is either Married, Single, Widowed or Divorced'),
  ],
  UserController.EditUserProfile
);

export default router;
