import { getTodaysDate } from './../../../functions/date'
import { getUserDetails } from './../../../functions/auth'
import { DevotionalType } from './../../../types/index'
import { getPaginationOptions } from './../../../utils/pagination'
import { validationResult } from 'express-validator'
import express from 'express'
import DevotionalModel from '../../v1/models/devotional.model';
import { getDateFilters } from '../../../functions/filters'

export default () => {
  const GetAllDevotionals = async (
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

      // find all devotionals

      const devotionalsData = await DevotionalModel.paginate(
        getDateFilters(req),
        paginationOptions
      )

      return res.status(200).json({
        message: 'All Devotionals Retrieved',
        data: devotionalsData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const GetDevotionalsForUser = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      // Get devotionals for user: Limited to the last 10 devotionals
      const limit = 31

      const devotionalsData = await DevotionalModel.find({
        date: { $lte: new Date() },
      })
        .sort({ date: -1 })
        .limit(limit)

      return res.status(200).json({
        message: 'Devotionals Retrieved',
        data: devotionalsData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const AddDevotional = async (
    req: express.Request<never, never, DevotionalType>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const {
        date,
        title,
        text,
        mainText,
        content,
        confession,
        furtherReading,
        oneYearBibleReading,
        twoYearsBibleReading,
      } = req.body

      const userDetails = await getUserDetails(req as any)

      // Check if devotional exists for this date

      const existingDevotional = await DevotionalModel.findOne({
        date: new Date(date),
      })
      if (existingDevotional)
        return res
          .status(400)
          .json({ message: 'Devotional for this date already exists' })

      const newDevotional = new DevotionalModel({
        date: new Date(date),
        title,
        text,
        mainText,
        content,
        confession,
        furtherReading,
        oneYearBibleReading,
        twoYearsBibleReading,
        createdBy: userDetails.fullname,
        updatedBy: userDetails.fullname,
      })

      await newDevotional.save()

      return res.status(200).json({
        message: 'Devotional added successfully',
        devotional: newDevotional,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const ViewDevotional = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      //increase view
      // find devotional
      const devotionalData = await DevotionalModel.findOneAndUpdate(
        { _id: id },
        { $inc: { views: 1 } },
        { new: true }
      )

      if (!devotionalData)
        return res.status(404).json({ message: 'Devotional not found' })

      return res.status(200).json({
        message: 'Devotional retrieved',
        devotional: devotionalData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const GetDayDevotional = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      // Get today's date
      const todaysDate = getTodaysDate()

      // find devotional

      const devotionalData = await DevotionalModel.findOneAndUpdate(
        {
          date: {
            $gte: todaysDate,
            $lte: todaysDate,
          },
        },
        { $inc: { views: 1 } },
        { new: true }
      )

      if (!devotionalData)
        return res.status(404).json({ message: 'Devotional not found' })

      return res.status(200).json({
        message: 'Devotional retrieved',
        devotional: devotionalData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const DeleteDevotional = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find devotional

      const devotionalData = await DevotionalModel.findById(id)

      if (!devotionalData)
        return res.status(404).json({ message: 'Devotional not found' })

      await DevotionalModel.findByIdAndDelete(id)

      return res.status(200).json({
        message: 'Devotional deleted',
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  interface UpdateBody extends DevotionalType {
    id: string
  }
  const UpdateDevotional = async (
    req: express.Request<never, never, UpdateBody>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const {
        id,
        date,
        title,
        text,
        mainText,
        content,
        confession,
        furtherReading,
        oneYearBibleReading,
        twoYearsBibleReading,
      } = req.body

      const userDetails = await getUserDetails(req as any)

      const existingDevotional = await DevotionalModel.findById(id)
      if (!existingDevotional)
        return res.status(404).json({ message: 'Devotional not found' })

      // Check if devotional exists for this date
      const existingDevotionalWithDate = await DevotionalModel.findOne({
        date: new Date(date),
      })
      if (
        existingDevotionalWithDate &&
        JSON.stringify(existingDevotionalWithDate) !==
          JSON.stringify(existingDevotional)
      )
        return res
          .status(400)
          .json({ message: 'Devotional for this date already exists' })

      existingDevotional.date = new Date(date)
      existingDevotional.title = title
      existingDevotional.text = text
      existingDevotional.mainText = mainText
      existingDevotional.content = content
      existingDevotional.confession = confession
      existingDevotional.furtherReading = furtherReading
      existingDevotional.oneYearBibleReading = oneYearBibleReading
      existingDevotional.twoYearsBibleReading = twoYearsBibleReading
      existingDevotional.updatedBy = userDetails.fullname

      await existingDevotional.save()

      return res.status(200).json({
        message: 'Devotional updated successfully',
        devotional: existingDevotional,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  return {
    GetAllDevotionals,
    AddDevotional,
    ViewDevotional,
    GetDayDevotional,
    DeleteDevotional,
    UpdateDevotional,
    GetDevotionalsForUser,
  }
}
