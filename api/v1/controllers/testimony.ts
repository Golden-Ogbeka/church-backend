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
      { status?: string },
      { page: number; limit: number; from: string; to: string }
    >,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const paginationOptions = getPaginationOptions(req as any)

      const { status } = req.body

      // find all testimonies

      const testimoniesData = status
        ? await TestimonyModel.paginate(
            { ...getDateFilters(req as any), status },
            paginationOptions
          )
        : await TestimonyModel.paginate(
            getDateFilters(req as any),
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

  // const GetTestimonyByStatus = async (
  //   req: express.Request<
  //     never,
  //     never,
  //     never,
  //     { page: number; limit: number; from: string; to: string; status: string }
  //   >,
  //   res: express.Response
  // ) => {
  //   try {
  //     // check for validation errors
  //     const errors = validationResult(req)
  //     if (!errors.isEmpty())
  //       return res.status(422).json({ errors: errors.array() })

  //     const { page = 1, limit = 10, status } = req.query

  //     const testimonies = await TestimonyModel.find({
  //       status,
  //     })
  //       .limit(limit * 1)
  //       .skip((page - 1) * limit)
  //       .exec()

  //     const count = await TestimonyModel.find({ status }).count()

  //     return res.status(200).json({
  //       message: `All ${status} testimonies retrieved`,
  //       data: testimonies,
  //       totalPages: Math.ceil(count / limit),
  //       curentPage: page,
  //     })
  //   } catch (error) {
  //     return res.status(500).json({ message: 'Internal Server Error' })
  //   }
  // }

  const ViewTestimony = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find testimony

      const testimonyData = await TestimonyModel.findById(id)

      if (!testimonyData)
        return res.status(404).json({ message: 'Testimony not found' })

      return res.status(200).json({
        message: 'Testimony retrieved successfully',
        testimony: testimonyData,
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
        testimony: testimonyData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }
  const ChangeStatus = async (
    req: express.Request<never, never, TestimonyType>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      const existingTestimony = await TestimonyModel.findById(id)
      if (!existingTestimony)
        return res.status(404).json({ message: 'Testimony not found' })

      let { status } = req.body

      existingTestimony.status = status
      await existingTestimony.save()
      return res.status(200).json({
        message: 'Testimony status updated successfully',
        testimony: existingTestimony,
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const GetApprovedTestimonies = async (
    req: express.Request<
      never,
      never,
      { status?: string },
      { page: number; limit: number; from: string; to: string }
    >,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const paginationOptions = getPaginationOptions(req as any)

      // find all approved testimonies

      const testimoniesData = await TestimonyModel.paginate(
        { ...getDateFilters(req as any), status: 'approved' },
        paginationOptions
      )
      return res.status(200).json({
        message: 'Testimonies Retrieved',
        data: testimoniesData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  return {
    GetAllTestimonies,
    AddTestimony,
    ChangeStatus,
    ViewTestimony,
    GetApprovedTestimonies,
  }
}
