import { isValidObjectId } from './../../../middlewares/shared'
import { isAdmin } from './../../../middlewares/auth'
import { isValidAPI } from '../../../middlewares/shared'
import { Router } from 'express'
import { body, header, param } from 'express-validator'

import Controller from '../controllers/tfccZone'
import { doesZoneExist, isValidZone } from '../../../middlewares/tfcc'

const router = Router()
const ZoneController = Controller()

// Get all zones
router.get(
  '/',
  [header('x-api-key', 'API Access Denied').exists().bail()],
  ZoneController.GetAllZones
)

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
)

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
)

// Update center
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
)

// Delete center by id
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
      .custom((value) => isAdmin(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidObjectId(value)),
  ],
  ZoneController.DeleteZone
)

export default router
