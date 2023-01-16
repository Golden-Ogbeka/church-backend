import { getUserDetails } from './../../../functions/auth';
import { EventType } from './../../../types/index';
import { getPaginationOptions } from './../../../utils/pagination';
import { validationResult } from 'express-validator';
import express from 'express'
import EventsModel from '../../../models/event.model';
import { getDateFilters } from '../../../functions/filters';
import { ObjectId } from 'mongodb'

export default () => {
    const GetAllEvents = async (req: express.Request<never, never, never, { page: number, limit: number, from: string, to: string }>, res: express.Response) => {
        try {
            // check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

            const paginationOptions = getPaginationOptions(req, { date: -1 })

            // find all devotionals

            const eventsData = await EventsModel.paginate(getDateFilters(req), paginationOptions);

            return res.status(200).json({
                message: "All Events Retrieved",
                data: eventsData
            });

        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    const AddEvent = async (req: express.Request<never, never, EventType>, res: express.Response) => {
        try {
            // check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

            const {
                date,
                name,
                theme,
                mainText,
                time,
                allowRegistration,
                registrationEntries,
                gallery,
                limitedNumberRegistration,
                registrationNumberLimit,
                limitedDateRegistration,
                registrationDateLimit,
                poster,
            } = req.body

            const userDetails = await getUserDetails(req as any);
            const newEvent = new EventsModel({
                date,
                name,
                theme,
                mainText,
                time,
                allowRegistration,
                registrationEntries,
                gallery,
                limitedNumberRegistration,
                registrationNumberLimit,
                limitedDateRegistration,
                registrationDateLimit,
                poster,
                createdBy: userDetails.fullname,
                updatedBy: userDetails.fullname
            })

            await newEvent.save()

            return res.status(200).json({
                message: "Event added successfully",
                devotional: newEvent
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    const ViewEvent = async (req: express.Request<{ id: string }>, res: express.Response) => {
        try {
            // check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

            const { id } = req.params

            // find devotional

            const eventData = await EventsModel.findById(id)


            if (!eventData) return res.status(404).json({ message: "Event not found" })

            return res.status(200).json({
                message: "Event retrieved successfully",
                event: eventData
            });

        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };


    const DeleteEvent = async (req: express.Request<{ id: string }>, res: express.Response) => {
        try {
            // check for validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

            const { id } = req.params

            // find devotional

            const eventData = await EventsModel.findById(id)

            if (!eventData) return res.status(404).json({ message: "Event not found" })

            await EventsModel.findByIdAndDelete(id)

            return res.status(200).json({
                message: "Event deleted"
            });

        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    interface UpdateBody extends EventType {
        id: string
    }

    return {
        GetAllEvents,
        AddEvent,
        ViewEvent,
        DeleteEvent,
    };
};
