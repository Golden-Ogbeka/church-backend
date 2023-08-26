const { EventGalleryModel } = require('./../models/eventGallery');
const { getUserDetails } = require('./../../../functions/auth');
const { validationResult } = require('express-validator');
const { getSequelizeDateFilters } = require('../../../functions/filters');
const { EventModel } = require('../models/event');
const {
  getResponseVariables,
  paginate,
} = require('../../../functions/pagination');

const Controller = () => {
  const GetAllEvents = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page } = req.query;

      // find all events

      const eventsData = await EventModel.findAndCountAll({
        include: [{ model: EventGalleryModel, as: 'gallery' }],
        order: [['date', 'DESC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All Events Retrieved',
        data: getResponseVariables(eventsData, limit),
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddEvent = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      //   Check for poster image
      const posterFile = req.file;
      if (!posterFile)
        return res.status(422).json({ message: 'No poster uploaded' });

      let {
        date,
        name,
        theme,
        mainText,
        time,
        allowRegistration,
        limitedNumberRegistration,
        registrationNumberLimit,
        limitedDateRegistration,
        registrationDateLimit,
        requiredRegistrationDetails,
        eventType,
        location,
        description,
      } = req.body;

      // Frontend is sending formData so this ensures the backend is communicating with a string
      if (
        allowRegistration &&
        typeof requiredRegistrationDetails !== 'string'
      ) {
        requiredRegistrationDetails = JSON.stringify(
          requiredRegistrationDetails
        );
      }

      if (allowRegistration) {
        requiredRegistrationDetails = JSON.parse(requiredRegistrationDetails);
      }

      // check for required registration fields
      if (allowRegistration && !requiredRegistrationDetails?.length)
        return res.status(400).json({
          message:
            'Please input the required registration details for this event',
        });

      // Check for errors in registration details and convert name of detail field
      const detailsError = [];

      if (allowRegistration) {
        requiredRegistrationDetails = requiredRegistrationDetails.map(
          (item) => {
            if (!item.name || !item.type) {
              return detailsError.push(item);
            }
            item.name = item?.name?.replace(/ /g, '_')?.toLocaleLowerCase(); //change name to have underscores instead of spaces
            item.type = item?.type?.toLocaleLowerCase().trim();

            return item;
          }
        );

        if (detailsError.length > 0) {
          return res.status(400).json({
            message: 'Name and type is required for each registration detail',
          });
        }
      }

      const userDetails = await getUserDetails(req);
      const newEvent = await EventModel.create({
        date: new Date(date),
        name,
        theme,
        mainText,
        time,
        allowRegistration,
        limitedNumberRegistration,
        registrationNumberLimit: Number(registrationNumberLimit),
        requiredRegistrationDetails: JSON.stringify(
          requiredRegistrationDetails
        ),
        limitedDateRegistration,
        registrationDateLimit,
        poster: posterFile.path,
        eventType,
        location,
        description,
        createdBy: userDetails.fullname,
        updatedBy: userDetails.fullname,
      });

      await newEvent.save();

      return res.status(200).json({
        message: 'Event added successfully',
        event: newEvent,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewEvent = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find event

      const eventData = await EventModel.findByPk(id, {
        include: [{ model: EventGalleryModel, as: 'gallery' }],
      });

      if (!eventData)
        return res.status(404).json({ message: 'Event not found' });

      return res.status(200).json({
        message: 'Event retrieved successfully',
        event: eventData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UpdateEvent = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      let {
        date,
        name,
        theme,
        mainText,
        time,
        allowRegistration,
        limitedNumberRegistration,
        registrationNumberLimit,
        limitedDateRegistration,
        registrationDateLimit,
        requiredRegistrationDetails,
        eventType,
        location,
        description,
      } = req.body;

      const { id } = req.params;

      if (
        allowRegistration &&
        typeof requiredRegistrationDetails !== 'string'
      ) {
        requiredRegistrationDetails = JSON.stringify(
          requiredRegistrationDetails
        );
      }

      if (allowRegistration) {
        requiredRegistrationDetails = JSON.parse(requiredRegistrationDetails);
      }

      // check for required registration fields
      if (allowRegistration && !requiredRegistrationDetails?.length) {
        return res.status(400).json({
          message:
            'Please input the required registration details for this event',
        });
      }

      const detailsError = [];

      if (allowRegistration) {
        requiredRegistrationDetails = requiredRegistrationDetails.map(
          (item) => {
            if (!item.name || !item.type) {
              return detailsError.push(item);
            }
            item.name = item?.name?.replace(/ /g, '_'); //change name to have underscores instead of spaces
            item.type = item?.type?.trim();

            return item;
          }
        );

        if (detailsError.length > 0) {
          return res.status(400).json({
            message: 'Name and type is required for each registration detail',
          });
        }
      }

      const userDetails = await getUserDetails(req);

      // Check if Event exists for this date
      const existingEvent = await EventModel.findByPk(id);
      if (!existingEvent)
        return res.status(404).json({ message: 'Event not found' });

      existingEvent.name = name;
      existingEvent.theme = theme;
      existingEvent.mainText = mainText;
      existingEvent.date = new Date(date);
      existingEvent.time = time;
      existingEvent.allowRegistration = allowRegistration;
      existingEvent.limitedNumberRegistration = limitedNumberRegistration;
      existingEvent.registrationNumberLimit = registrationNumberLimit;
      existingEvent.registrationDateLimit = registrationDateLimit;
      existingEvent.limitedDateRegistration = limitedDateRegistration;
      existingEvent.requiredRegistrationDetails = requiredRegistrationDetails
        ? JSON.stringify(requiredRegistrationDetails)
        : existingEvent.requiredRegistrationDetails;
      existingEvent.poster = req.file ? req.file.path : existingEvent.poster;
      existingEvent.eventType = eventType;
      existingEvent.location = location;
      existingEvent.description = description;

      existingEvent.updatedBy = userDetails.fullname;

      await existingEvent.save();

      return res.status(200).json({
        message: 'Event updated successfully',
        event: existingEvent,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteEvent = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find event

      const eventData = await EventModel.findByPk(id);

      if (!eventData)
        return res.status(404).json({ message: 'Event not found' });

      await EventModel.destroy({ where: { id } });

      return res.status(200).json({
        message: 'Event deleted Successfully',
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const eventRegistrationCheck = (event) => {
    if (!event.allowRegistration)
      return { status: false, message: "Event doesn't allow registration" };
    if (
      event.limitedNumberRegistration &&
      event.registrationEntries &&
      event.registrationEntries.length >= event.registrationNumberLimit
    )
      return { status: false, message: 'Registration Limit reached' };
    if (
      event.limitedDateRegistration &&
      Date.now() > event.registrationDateLimit.getTime()
    )
      return { status: false, message: 'Registration deadline elapsed' };
    return { status: true };
  };

  const RegisterEvent = async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });
      const { id } = req.params;

      const event = await EventModel.findByPk(id);

      if (!event) return res.status(404).json({ message: 'Event not found' });

      if (!eventRegistrationCheck(event).status)
        return res
          .status(422)
          .json({ message: eventRegistrationCheck(event).message });

      let regDetails = {};
      let regErrors = [];

      event.requiredRegistrationDetails.forEach((item) => {
        if (!(item.name in req.body)) {
          regErrors.push(`The ${item.name} field is required`);
        }
        regDetails[`${item.name}`] = req.body[item.name];
      });
      if (regErrors.length > 0)
        return res.status(404).json({ message: regErrors });

      event.registrationEntries = event.registrationEntries
        ? JSON.stringify([...event.registrationEntries, regDetails])
        : JSON.stringify([regDetails]);

      await event.save();

      return res.status(200).json({
        message: 'Registered successfully',
        details: {
          event: event.name,
          date: event.date,
          regDetails: regDetails,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const UploadEventImages = async (req, res) => {
    try {
      const { id } = req.params;

      const eventData = await EventModel.findByPk(id, {
        include: [{ model: EventGalleryModel, as: 'gallery' }],
      });
      if (!eventData)
        return res.status(404).json({ message: 'Event not found' });

      const fileArray = req.files;
      if (!fileArray)
        return res.status(422).json({ message: 'No file to upload' });

      for (let i = 0; i < fileArray.length; i++) {
        await EventGalleryModel.create({
          imageURL: fileArray[i].path,
          event_id: Number(id),
        });
      }

      await eventData.reload();

      return res.status(200).json({
        message: 'Event gallery updated successfully',
        event: eventData,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const DeleteGalleryImage = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;
      const { image_id } = req.body;

      // find event
      const eventData = await EventModel.findByPk(id);

      if (!eventData)
        return res.status(404).json({ message: 'Event not found' });

      // find Image
      const imageData = await EventGalleryModel.findByPk(image_id);

      if (!imageData)
        return res.status(404).json({ message: 'Image not found' });

      await EventGalleryModel.destroy({ where: { id: image_id } });

      return res.status(200).json({
        message: 'Image deleted from gallery',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  return {
    GetAllEvents,
    AddEvent,
    ViewEvent,
    DeleteEvent,
    UpdateEvent,
    RegisterEvent,
    UploadEventImages,
    DeleteGalleryImage,
  };
};

module.exports = Controller;
