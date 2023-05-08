import { getUserDetails } from './../../../functions/auth'
import { EventType, RegistrationDetailType } from './../../../types/index'
import { getPaginationOptions } from './../../../utils/pagination'
import { validationResult } from 'express-validator'
import express from 'express'
import EventsModel, { IEvent } from '../models/event.model';
import { getDateFilters } from '../../../functions/filters'

export default () => {
  const GetAllEvents = async (
    req: express.Request<
      never,
      never,
      never,
      { page: number; limit: number; from: string; to: string }
    >,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const paginationOptions = getPaginationOptions(req, { date: -1 })

      // find all events

      const eventsData = await EventsModel.paginate(
        getDateFilters(req),
        paginationOptions
      )

      return res.status(200).json({
        message: 'All Events Retrieved',
        data: eventsData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const AddEvent = async (
    req: express.Request<never, never, EventType>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      //   Check for poster image
      const posterFile: any = req.file
      if (!posterFile)
        return res.status(404).json({ message: 'No poster uploaded' })

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
      } = req.body

      // return console.log(date)

      if (
        allowRegistration &&
        typeof requiredRegistrationDetails !== 'string'
      ) {
        requiredRegistrationDetails = JSON.stringify(
          requiredRegistrationDetails
        )
      }

      if (allowRegistration) {
        requiredRegistrationDetails = JSON.parse(requiredRegistrationDetails)
      }

      // check for required registration fields
      if (allowRegistration && !requiredRegistrationDetails?.length)
        return res.status(400).json({
          message:
            'Please input the required registration details for this event',
        })

      // Check for errors in registration details and convert name of detail field
      const detailsError: any[] = []

      if (allowRegistration) {
        requiredRegistrationDetails = requiredRegistrationDetails.map(
          (item: RegistrationDetailType) => {
            if (!item.name || !item.type) {
              return detailsError.push(item)
            }
            item.name = item?.name?.replace(/ /g, '_') //change name to have underscores instead of spaces
            item.type = item?.type?.trim()

            return item
          }
        )

        if (detailsError.length > 0) {
          return res.status(400).json({
            message: 'Name and type is required for each registration detail',
          })
        }
      }

      const userDetails = await getUserDetails(req as any)
      const newEvent = new EventsModel({
        date: new Date(date),
        name,
        theme,
        mainText,
        time,
        allowRegistration,
        limitedNumberRegistration,
        registrationNumberLimit: Number(registrationNumberLimit),
        requiredRegistrationDetails,
        limitedDateRegistration,
        registrationDateLimit,
        poster: posterFile.path,
        eventType,
        location,
        description,
        createdBy: userDetails.fullname,
        updatedBy: userDetails.fullname,
      })

      await newEvent.save()

      return res.status(200).json({
        message: 'Event added successfully',
        event: newEvent,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const ViewEvent = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find event

      const eventData = await EventsModel.findById(id)

      if (!eventData)
        return res.status(404).json({ message: 'Event not found' })

      return res.status(200).json({
        message: 'Event retrieved successfully',
        event: eventData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const UpdateEvent = async (
    req: express.Request<{ id: string }, never, EventType>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

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
      } = req.body

      const { id } = req.params

      if (
        allowRegistration &&
        typeof requiredRegistrationDetails !== 'string'
      ) {
        requiredRegistrationDetails = JSON.stringify(
          requiredRegistrationDetails
        )
      }

      if (allowRegistration) {
        requiredRegistrationDetails = JSON.parse(requiredRegistrationDetails)
      }

      // check for required registration fields
      if (allowRegistration && !requiredRegistrationDetails?.length) {
        return res.status(400).json({
          message:
            'Please input the required registration details for this event',
        })
      }

      const detailsError: any[] = []

      if (allowRegistration) {
        requiredRegistrationDetails = requiredRegistrationDetails.map(
          (item: RegistrationDetailType) => {
            if (!item.name || !item.type) {
              return detailsError.push(item)
            }
            item.name = item?.name?.replace(/ /g, '_') //change name to have underscores instead of spaces
            item.type = item?.type?.trim()

            return item
          }
        )

        if (detailsError.length > 0) {
          return res.status(400).json({
            message: 'Name and type is required for each registration detail',
          })
        }
      }

      const userDetails = await getUserDetails(req as any)

      // Check if Event exists for this date
      const existingEvent = await EventsModel.findById(id)
      if (!existingEvent)
        return res.status(404).json({ message: 'Event not found' })

      existingEvent.name = name
      existingEvent.theme = theme
      existingEvent.mainText = mainText
      existingEvent.date = new Date(date)
      existingEvent.time = time
      existingEvent.allowRegistration = allowRegistration
      existingEvent.limitedNumberRegistration = limitedNumberRegistration
      existingEvent.registrationNumberLimit = registrationNumberLimit
      existingEvent.registrationDateLimit = registrationDateLimit
      existingEvent.limitedDateRegistration = limitedDateRegistration
      existingEvent.requiredRegistrationDetails = requiredRegistrationDetails
      existingEvent.poster = req.file ? req.file.path : existingEvent.poster
      existingEvent.eventType = eventType
      existingEvent.location = location
      existingEvent.description = description

      existingEvent.updatedBy = userDetails.fullname

      await existingEvent.save()

      return res.status(200).json({
        message: 'Event updated successfully',
        event: existingEvent,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const DeleteEvent = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find event

      const eventData = await EventsModel.findById(id)

      if (!eventData)
        return res.status(404).json({ message: 'Event not found' })

      await EventsModel.findByIdAndDelete(id)

      return res.status(200).json({
        message: 'Event deleted Successfully',
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const eventRegistrationCheck = (event: IEvent) => {
    if (!event.allowRegistration)
      return { status: false, message: "Event doesn't allow registration" }
    if (
      event.limitedNumberRegistration &&
      event.registrationEntries.length >= event.registrationNumberLimit
    )
      return { status: false, message: 'Registration Limit reached' }
    if (
      event.limitedDateRegistration &&
      Date.now() > event.registrationDateLimit.getTime()
    )
      return { status: false, message: 'Registration deadline elapsed' }
    return { status: true }
  }

  const RegisterEvent = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })
      const { id } = req.params
      const event = await EventsModel.findById(id)
      if (!event) return res.status(404).json({ message: 'Event not found' })
      if (!eventRegistrationCheck(event).status)
        return res
          .status(404)
          .json({ message: eventRegistrationCheck(event).message })
      let regDetails: any = {}
      let regErrors: any = []

      event.requiredRegistrationDetails.forEach((item) => {
        if (!(item.name in req.body)) {
          regErrors.push(`The ${item.name} field is required`)
        }
        regDetails[`${item.name}`] = req.body[item.name]
      })
      if (regErrors.length > 0)
        return res.status(404).json({ message: regErrors })

      event.registrationEntries.push(regDetails)
      await event.save()

      return res.status(200).json({
        message: 'Registered successfully',
        userDetails: {
          event: event.name,
          date: event.date,
          regDetails: regDetails,
        },
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const UploadEventImages = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      const { id } = req.params
      const event = await EventsModel.findById(id)
      if (!event) return res.status(404).json({ message: 'Event not found' })
      const fileArray: any = req.files
      if (!fileArray)
        return res.status(404).json({ message: 'No file to upload' })
      for (let i: number = 0; i < fileArray.length; i++) {
        event.gallery.push(fileArray[i].path)
      }
      await event.save()
      return res.status(200).json({
        message: 'Event gallery updated successfully',
        event: event,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const DeleteGalleryImage = async (
    req: express.Request<{ id: string }, never, { imageURL: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find event
      const eventData = await EventsModel.findById(id)

      if (!eventData)
        return res.status(404).json({ message: 'Event not found' })

      eventData.gallery = eventData.gallery.filter(
        (image) => image !== req.body.imageURL
      )
      await eventData.save()

      return res.status(200).json({
        message: 'Image deleted from gallery',
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  return {
    GetAllEvents,
    AddEvent,
    ViewEvent,
    DeleteEvent,
    UpdateEvent,
    RegisterEvent,
    UploadEventImages,
    DeleteGalleryImage,
  }
}
