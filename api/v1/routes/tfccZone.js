const { isValidObjectId } = require('../middlewares/shared');
const { isAdmin, isSuperAdmin } = require('../middlewares/auth');
const { isValidAPI } = require('../middlewares/shared');
const { Router } = require('express');
const { body, header, param } = require('express-validator');

const Controller = require('../controllers/tfccZone');
const { doesZoneExist } = require('../middlewares/tfcc');

const router = Router();
const ZoneController = Controller();

// Get all zones
router.get(
  '/',
  [header('x-api-key', 'API Access Denied').exists().bail()],
  ZoneController.GetAllZones
);

// Get specific zone
router.get(
  '/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidObjectId(value)),
  ],
  ZoneController.ViewZone
);

// Add Zone
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
    body('name', 'Name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Name cannot be empty')
      .custom((value) => doesZoneExist(value)),
  ],
  ZoneController.AddZone
);

// Update zone
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
      .custom((value) => isValidObjectId(value)),
    body('name', 'Name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Name cannot be empty'),
  ],
  ZoneController.UpdateZone
);

// Delete zone by id
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
      .custom((value) => isValidObjectId(value)),
  ],
  ZoneController.DeleteZone
);

module.exports = router;
