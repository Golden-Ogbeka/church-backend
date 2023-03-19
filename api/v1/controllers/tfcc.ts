import { getUserDetails } from './../../../functions/auth'
import { TFCCType } from './../../../types/index'
import { getPaginationOptions } from './../../../utils/pagination'
import { validationResult } from 'express-validator'
import express from 'express'
import TFCCModel from '../../../models/tfcc.model'
import { TFFDocumentType } from '../../../models/tfcc.model'
import { getDateFilters } from '../../../functions/filters'

export default () => {
  const GetAllCenters = async (
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

      // sort by address
      const paginationOptions = getPaginationOptions(req as any, {
        address: 1,
      })

      // find all centers

      const centersData = await TFCCModel.paginate(
        getDateFilters(req as any),
        paginationOptions
      )

      return res.status(200).json({
        message: 'All Centers Retrieved',
        data: centersData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const ViewCenter = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find center

      const centerData = await TFCCModel.findById(id)

      if (!centerData)
        return res.status(404).json({ message: 'Center not found' })

      return res.status(200).json({
        message: 'Center retrieved successfully',
        center: centerData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const AddCenter = async (
    req: express.Request<never, never, TFCCType>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { cellLeader, phoneNumber, address, zone } = req.body

      const centerData = new TFCCModel({
        cellLeader,
        phoneNumber,
        address,
        zone,
      })
      await centerData.save()

      return res.status(200).json({
        message: 'TFCC Center added',
        center: centerData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const UpdateCenter = async (
    req: express.Request<{ id: string }, never, TFCCType>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      let { cellLeader, phoneNumber, address, zone } = req.body

      const { id } = req.params

      const userDetails = await getUserDetails(req as any)

      // Check if Center exists
      const existingCenter: TFFDocumentType | null = await TFCCModel.findById(
        id
      )

      if (!existingCenter)
        return res.status(404).json({ message: 'Center not found' })

      existingCenter.cellLeader = cellLeader
      existingCenter.phoneNumber = phoneNumber
      existingCenter.address = address
      existingCenter.zone = zone

      existingCenter.updatedBy = userDetails.fullname

      await existingCenter.save()

      return res.status(200).json({
        message: 'Center updated successfully',
        center: existingCenter,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const DeleteCenter = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find center

      const centerData = await TFCCModel.findById(id)

      if (!centerData)
        return res.status(404).json({ message: 'Center not found' })

      await TFCCModel.findByIdAndDelete(id)

      return res.status(200).json({
        message: 'Center deleted Successfully',
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  return {
    GetAllCenters,
    AddCenter,
    ViewCenter,
    UpdateCenter,
    DeleteCenter,
  }
}
