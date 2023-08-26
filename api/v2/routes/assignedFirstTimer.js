const { isValidID } = require('../middlewares/shared');
const { isAdmin, isSuperAdmin } = require('../middlewares/access');
const { isValidAPI } = require('../middlewares/shared');
const { Router } = require('express');
const { body, header, param, query } = require('express-validator');
const Controller = require('../controllers/assignedFirstTimer');

const router = Router();
const AssignedFirstTimer = Controller();

// Get all assigned first timers
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
      .custom((value) => isAdmin(value)),
  ],
  AssignedFirstTimer.GetAllAssignedFirstTimers
);

// Get single assigned first timer
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
      .custom((value) => isAdmin(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
  ],
  AssignedFirstTimer.GetAssignedFirstTimer
);

// Get single assigned first timer
router.get(
  '/leader',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
    query('leader_id')
      .optional()
      .custom((value) => isValidID(value)),
    query('leader_name').optional().trim(),
  ],
  AssignedFirstTimer.GetAssignedFirstTimerForLeader
);

// Get assigned first timers by status
router.get(
  '/status/:status',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
    param('status', 'Status is required')
      .exists()
      .isIn(['Open', 'Closed'])
      .withMessage('Status is either Open or Closed'),
  ],
  AssignedFirstTimer.GetAssignedFirstTimersByStatus
);

// Assign first timer to TFCC leader
router.post(
  '/assign',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
    body('visitor_id', 'Visitor ID is required')
      .exists()
      .custom((value) => isValidID(value)),
    body('leader_id', 'TFCC Leader ID is required')
      .exists()
      .custom((value) => isValidID(value)),
  ],
  AssignedFirstTimer.AssignFirstTimer
);

// Update assigned first timer
router.patch(
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
    body('response', 'Church category is required').optional().trim(),
    body('status', 'Status is required')
      .optional()
      .isIn(['Open', 'Closed'])
      .withMessage('Status is either Open or Closed'),
  ],
  AssignedFirstTimer.UpdateAssignedFirstTimer
);

// Delete assigned first timer by id
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
  AssignedFirstTimer.DeleteAssignedFirstTimer
);

module.exports = router;
