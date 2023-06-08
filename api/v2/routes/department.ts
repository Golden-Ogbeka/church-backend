import { Router } from 'express';
import { body, header, param } from 'express-validator';
import Controller from '../controllers/department';
import { isAdmin } from '../middlewares/access';
import { isValidAPI, isValidID } from '../middlewares/shared';

const router = Router();
const DepartmentController = Controller();

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
  DepartmentController.GetAllDepartments
);

// Get department by id
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
      .custom((value) => isAdmin(value)),
  ],
  DepartmentController.ViewDepartment
);

router.post(
  '/',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    body('names', 'Department name is required')
      .trim()
      .exists()
      .notEmpty()
      .withMessage('Department name cannot be empty'),
  ],
  DepartmentController.AddDepartment
);

router.put(
  '/:id',
  [
    header('x-api-key', 'API Access Denied')
      .exists()
      .bail()
      .custom((value) => isValidAPI(value)),
    param('id', 'ID is required')
      .exists()
      .custom((value) => isValidID(value)),
    body('names', 'Department name is required').optional().trim(),
  ],
  DepartmentController.UpdateDepartment
);

router.delete(
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
  DepartmentController.DeleteDepartment
);

export default router;
