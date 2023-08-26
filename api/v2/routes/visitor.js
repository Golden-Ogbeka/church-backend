const { isValidID } = require('../middlewares/shared');
const { isAdmin, isSuperAdmin } = require('../middlewares/access');
const { isValidAPI } = require('../middlewares/shared');
const { Router } = require('express');
const { body, header, param, query } = require('express-validator');
const Controller = require('../controllers/visitor');

const router = Router();
const VisitorController = Controller();

// Get all visitors
router.get(
  '/',
  [header('x-api-key', 'API Access Denied').exists().bail()],
  VisitorController.GetAllVisitors
);

// Get visitors by time (first or second)
router.get(
  '/time',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    query('timerValue', 'Timer value is required')
      .exists()
      .isIn(['first', 'second'])
      .withMessage('Timer value is either first or second'),
  ],
  VisitorController.GetAllVisitorsByFilter
);

// Get specific visitor
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
  VisitorController.ViewVisitor
);

// Add Visitor
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
    body('address', 'Address is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Address cannot be empty'),
    body('nearest', 'Nearest bus-stop is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Nearest bus-stop cannot be empty'),
    body('marital', 'Marital status is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Marital status cannot be empty')
      .isIn(['Married', 'Single', 'Widowed', 'Divorced', 'Engaged'])
      .withMessage(
        'Marital status is either Married, Single, Widowed, Engaged or Divorced'
      ),
    body('gender', 'Gender is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Gender cannot be empty')
      .isIn(['Male', 'Female'])
      .withMessage('Gender is either Male or Female'),
    body('phone', 'Phone number is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Phone number cannot be empty'),
    body('email', 'Email is required')
      .trim()
      .exists()
      .bail()
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage('Invalid Email format'),
    body('contact_mode', 'Contact mode is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Contact mode cannot be empty'),
    body('service_opinion', 'Service opinion is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Service opinion cannot be empty')
      .isIn(['Poor', 'Fair', 'Good', 'Excellent'])
      .withMessage('Service opinion is either Poor, Fair, Good or Excellent'),
    body('suggestions').trim().optional(),
    body('membership', 'Membership decision is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Membership decision cannot be empty'),
    body('dated', 'Date of visit is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Date of visit cannot be empty')
      .isISO8601()
      .toDate()
      .withMessage('Enter a valid date'),
    body('category', 'Church category is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Church category cannot be empty'),
    body('timerValue', 'Timer value is required')
      .exists()
      .isIn(['first', 'second'])
      .withMessage('Timer value is either first or second'),
  ],
  VisitorController.AddVisitor
);

// Update visitor
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
    body('address', 'Address is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Address cannot be empty'),
    body('nearest', 'Nearest bus-stop is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Nearest bus-stop cannot be empty'),
    body('marital', 'Marital status is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Marital status cannot be empty')
      .isIn(['Married', 'Single', 'Widowed', 'Divorced', 'Engaged'])
      .withMessage(
        'Marital status is either Married, Single, Widowed, Engaged or Divorced'
      ),
    body('gender', 'Gender is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Gender cannot be empty')
      .isIn(['Male', 'Female'])
      .withMessage('Gender is either Male or Female'),
    body('phone', 'Phone number is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Phone number cannot be empty'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .normalizeEmail({ all_lowercase: true })
      .withMessage('Invalid Email format'),
    body('contact_mode', 'Contact mode is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Contact mode cannot be empty'),
    body('service_opinion')
      .optional()
      .isIn(['Poor', 'Fair', 'Good', 'Excellent'])
      .withMessage('Service opinion is either Poor, Fair, Good or Excellent'),
    body('suggestions').trim().optional(),
    body('membership', 'Membership decision is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Membership decision cannot be empty'),
    body('dated', 'Date of visit is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Date of visit cannot be empty')
      .isISO8601()
      .toDate()
      .withMessage('Enter a valid date'),
    body('category', 'Church category is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Church category cannot be empty'),
    body('timerValue', 'Timer value is required')
      .exists()
      .isIn(['first', 'second'])
      .withMessage('Timer value is either first or second'),
    body('assigned')
      .optional()
      .isBoolean()
      .withMessage('Assigned status must be boolean')
      .toBoolean(),
  ],
  VisitorController.UpdateVisitor
);

// Delete visitor by id
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
  VisitorController.DeleteVisitor
);

module.exports = router;
