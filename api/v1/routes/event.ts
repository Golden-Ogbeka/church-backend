import { isValidObjectId } from './../../../middlewares/shared';
import { isAdmin } from './../../../middlewares/auth';
import { isValidAPI } from '../../../middlewares/shared';
import { Router } from 'express';
import { body, header, param, query } from 'express-validator';
import Controller from '../controllers/event';

const router = Router();
const EventController = Controller();

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
    EventController.GetAllEvents
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
        body('date', 'Date is required').trim().exists().notEmpty().withMessage("Date cannot be empty").isISO8601().toDate().withMessage("Enter a valid date"),

        body('name', 'Name is required').trim().exists().notEmpty().withMessage("Nmae cannot be empty"),
        body('time', 'Time is required').trim().exists().notEmpty().withMessage("Time cannot be empty"),
        body('allowRegistration', 'Allow Registration is required').trim().exists().isBoolean().withMessage("Allow Registration must be boolean"),
        body('limitedNumberRegistration', 'Limited Number Registration is required').trim().exists().isBoolean().withMessage("Allow Limited Number of Registation must be boolean"),
        body('limitedDateRegistration', 'Limited Date  Registration is required').trim().exists().isBoolean().withMessage("Allow Limited Number of Registation must be boolean"),

    ],
    EventController.AddEvent
);

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

        param("id", "ID is required").exists().custom(value => isValidObjectId(value)),
        body('date', 'Date is required').trim().exists().notEmpty().withMessage("Date cannot be empty").isISO8601().toDate().withMessage("Enter a valid date"),

        body('name', 'Name is required').trim().exists().notEmpty().withMessage("Nmae cannot be empty"),
        body('time', 'Time is required').trim().exists().notEmpty().withMessage("Time cannot be empty"),
        body('allowRegistration', 'Allow Registration is required').trim().exists().isBoolean().withMessage("Allow Registration must be boolean"),
        body('limitedNumberRegistration', 'Limited Number Registration is required').trim().exists().isBoolean().withMessage("Allow Limited Number of Registation must be boolean"),
        body('limitedDateRegistration', 'Limited Date  Registration is required').trim().exists().isBoolean().withMessage("Allow Limited Number of Registation must be boolean"),



    ],
    EventController.UpdateEvent
);



// Get devotional by id
router.get(
    '/:id',
    [
        header('x-api-key', 'API Access Denied')
            .exists()
            .bail()
            .custom((value) => isValidAPI(value)),
        param("id", "ID is required").exists().custom(value => isValidObjectId(value))
    ],
    EventController.ViewEvent
);



// Delete devotional by id
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
        param("id", "ID is required").exists().custom(value => isValidObjectId(value))
    ],
    EventController.DeleteEvent
);

export default router;
