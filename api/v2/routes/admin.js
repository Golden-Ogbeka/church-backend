const {
  isValidAdminRole,
  isValidAPI,
  isValidID,
} = require('../middlewares/shared');
const { Router } = require('express');
const { body, header, param } = require('express-validator');
const Controller = require('../controllers/admin');
const { isAdmin, isSuperAdmin } = require('../middlewares/access');

const router = Router();
const AdminController = Controller();

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
  AdminController.GetAllAdmins
);

router.post(
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
    body('email', 'Email is required')
      .trim()
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage('Invalid Email format'),
    body('password', 'Password is required').trim().exists(),
    body('fullname', 'Full name is required').trim().exists(),
    body('role', 'Role is required')
      .trim()
      .exists()
      .custom((value) => isValidAdminRole(value)),
  ],
  AdminController.AddAdmin
);

// Change admin status
router.patch(
  '/status',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isSuperAdmin(value)),
    body('id', 'ID is required')
      .exists()
      .notEmpty()
      .withMessage('ID cannot be empty')
      .custom((value) => isValidID(value)),
    body('status', 'Status is required')
      .exists()
      .isBoolean()
      .withMessage('Status must be either true or false'),
  ],
  AdminController.ChangeAdminStatus
);

// Make super admin
router.patch(
  '/super',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isSuperAdmin(value)),
    body('id', 'ID is required')
      .exists()
      .notEmpty()
      .withMessage('ID cannot be empty')
      .custom((value) => isValidID(value)),
  ],
  AdminController.MakeSuperAdmin
);

// Get admin by id
router.get(
  '/view/:id',
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
  AdminController.ViewAdmin
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
  AdminController.Login
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
  AdminController.ResetPasswordRequest
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
    body('verificationCode', 'Verification code is required').trim().exists(),
  ],
  AdminController.ResetPasswordUpdate
);

module.exports = router;
