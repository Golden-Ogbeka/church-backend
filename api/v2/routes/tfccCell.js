const {
  isValidChurchId,
  isValidID,
  isValidLeaderId,
  isValidZoneId,
} = require('../middlewares/shared');
const { isAdmin, isSuperAdmin } = require('../middlewares/access');
const { isValidAPI } = require('../middlewares/shared');
const { Router } = require('express');
const { body, header, param } = require('express-validator');
const Controller = require('../controllers/tfccCell');

const router = Router();
const CellController = Controller();

// Get all TFCC cells
router.get(
  '/cells',
  [header('x-api-key', 'API Access Denied').exists().bail()],
  CellController.GetAllCells
);

// Get specific cell
router.get(
  '/cell/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
  ],
  CellController.ViewCell
);

// Add cell
router.post(
  '/cell',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    header('authorization', 'Please specify an authorization header')
      .exists()
      .bail()
      .custom((value) => isAdmin(value)),
    body('church_id', 'Church ID is required')
      .exists()
      .custom((value) => isValidID(value))
      .custom((value) => isValidChurchId(value)),
    body('zone_id', 'Zone ID is required')
      .exists()
      .custom((value) => isValidID(value))
      .custom((value) => isValidZoneId(value)),
    body('host_address', 'Address is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Address cannot be empty'),
    body('cell_leader_id', 'Cell leader id is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Cell leader id cannot be empty')
      .custom((value) => isValidLeaderId(value)),
  ],
  CellController.AddCell
);

// Update cell
router.patch(
  '/cell/:id',
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
    body('church_id', 'Church ID is required')
      .exists()
      .custom((value) => isValidID(value))
      .custom((value) => isValidChurchId(value)),
    body('zone_id', 'Zone ID is required')
      .exists()
      .custom((value) => isValidID(value))
      .custom((value) => isValidZoneId(value)),
    body('host_address', 'Address is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Address cannot be empty'),
    body('cell_leader_id', 'Cell leader id is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Cell leader id cannot be empty')
      .custom((value) => isValidLeaderId(value)),
  ],
  CellController.UpdateCell
);

// Delete cell by id
router.delete(
  '/cell/:id',
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
  CellController.DeleteCell
);

module.exports = router;
