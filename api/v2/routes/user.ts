import { isValidObjectId } from '../../v1/middlewares/shared'
import { isAdmin, isSuperAdmin } from '../../v1/middlewares/auth'
import { isValidAPI } from '../../v1/middlewares/shared'
import { Router } from 'express'
import { body, header, param, query } from 'express-validator'
import Controller from '../controllers/user'

const router = Router()
const UserController = Controller()

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
)

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
      .custom((value) => isValidObjectId(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isSuperAdmin(value)),
  ],
  UserController.ViewUser
)

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
)

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
    body('phoneNumber', 'Phone number is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Phone number cannot be empty'),
    body('firstName', 'First name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lastName', 'Last name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Last name cannot be empty'),
    body('dateOfBirth', 'Date of birth is required')
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
      .withMessage('Registration source cannot be empty'),
  ],
  UserController.Register
)

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
)

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
    body('verificationCode', 'Verification code is required').trim().exists(),
  ],
  UserController.ResetPasswordUpdate
)

export default router
