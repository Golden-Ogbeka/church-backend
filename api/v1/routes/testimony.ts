import { isValidObjectId } from './../../../middlewares/shared';
import { isAdmin } from './../../../middlewares/auth';
import {
  isValidAPI,
  isValidSource,
  isValidStatus,
} from '../../../middlewares/shared'
import { Router } from 'express';
import { body, header, param, query } from 'express-validator';
import { parser } from '../../../functions/cloudinary';

import Controller from '../controllers/testimony';

const router = Router();
const TestimonyController = Controller();

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
    TestimonyController.GetAllTestimonies
);

router.post(
    '/',
    [
        header('x-api-key', 'API Access Denied')
            .exists()
            .bail()
            .custom((value) => isValidAPI(value)),

        body('fullName', 'Full Name is required')
            .trim()
            .exists()
            .notEmpty()
            .withMessage('Full Name cannot be empty'),

        body('phoneNumber', 'phoneNumber is required')
            .trim()
            .exists()
            .notEmpty()
            .withMessage('Phone number cannot be empty'),

        body('content', 'Content is required')
            .trim()
            .exists()
            .notEmpty()
            .withMessage('Content cannot be empty'),
        body('source', 'source is required')
            .trim()
            .exists()
            .custom((value) => isValidSource(value))

    ],
    TestimonyController.AddTestimony
);
router.patch(
  '/:id/change-status',
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
    body('status', 'Status is required')
      .trim()
      .exists()
      .custom((value) => isValidStatus(value)),
  ],
  TestimonyController.ChangeStatus
)




export default router;
