import { getUserDetails } from './../../../functions/auth'
import { TestimonyType } from './../../../types/index'
import { getPaginationOptions } from './../../../utils/pagination'
import { validationResult } from 'express-validator'
import express from 'express'
import TestimonyModel, { ITestimony } from '../../../models/testimony.model'
import { getDateFilters } from '../../../functions/filters'

export default () => {
  const GetAllTestimonies = async (
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

      const testimoniesData = await TestimonyModel.paginate(
        getDateFilters(req),
        paginationOptions
      )

      return res.status(200).json({
        message: 'All Testimonies Retrieved',
        data: testimoniesData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const AddTestimony = async (
    req: express.Request<never, never, TestimonyType>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { email, content, fullName, summary, source, phoneNumber } =
        req.body

      const testimonyData = new TestimonyModel({
        fullName,
        content,
        summary,
        source,
        email,
        phoneNumber,
      })
      await testimonyData.save()

      return res.status(200).json({
        message: 'Testimony added successfully',
        event: testimonyData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  interface UpdateBody extends TestimonyType {
    id: string
  }

  return {
    GetAllTestimonies,
    AddTestimony,
  }
}
