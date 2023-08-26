const { isValidID } = require('../middlewares/shared');
const { isAdmin, isSuperAdmin } = require('../middlewares/access');
const { isValidAPI } = require('../middlewares/shared');
const { Router } = require('express');
const { body, header, param } = require('express-validator');
const Controller = require('../controllers/tfccLeader');

const router = Router();
const LeaderController = Controller();

// Get all leaders
router.get(
  '/',
  [header('x-api-key', 'API Access Denied').exists().bail()],
  LeaderController.GetAllLeaders
);

// Get specific leader
router.get(
  '/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
  ],
  LeaderController.ViewLeader
);

// Add Leader
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
    body('firstname', 'First name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lastname', 'Last name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Last name cannot be empty'),
    body('email', 'Email is required')
      .trim()
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage('Invalid Email format'),
    body('mobile', 'Phone number is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Phone number cannot be empty'),
    body('role', 'Role is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Role cannot be empty')
      .isIn(['Group Leader', 'Cell Leader', 'Admin'])
      .withMessage('Role is either Group Leader, Cell Leader or Admin'),
  ],
  LeaderController.AddLeader
);

// Update leader
router.put(
  '/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
    body('firstname', 'First name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('First name cannot be empty'),
    body('lastname', 'Last name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Last name cannot be empty'),
    body('email', 'Email is required')
      .trim()
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage('Invalid Email format'),
    body('mobile', 'Phone number is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Phone number cannot be empty'),
    body('role', 'Role is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Role cannot be empty')
      .isIn(['Group Leader', 'Cell Leader', 'Admin'])
      .withMessage('Role is either Group Leader, Cell Leader or Admin'),
  ],
  LeaderController.UpdateLeader
);

// Delete leader by id
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
  LeaderController.DeleteLeader
);

module.exports = router;
