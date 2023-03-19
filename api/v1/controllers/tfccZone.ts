import { getUserDetails } from './../../../functions/auth'
import { TFCCZoneType } from './../../../types/index'
import { validationResult } from 'express-validator'
import express from 'express'
import TFCCZoneModel from '../../../models/tfccZone.model'
import { TFCCZoneDocumentType } from '../../../models/tfccZone.model'

export default () => {
  const GetAllZones = async (
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

      // find all zones

      const zonesData = await TFCCZoneModel.find().sort({ name: 1 })

      return res.status(200).json({
        message: 'All Zones Retrieved',
        data: zonesData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const ViewZone = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find zone

      const zoneData = await TFCCZoneModel.findById(id)

      if (!zoneData) return res.status(404).json({ message: 'Zone not found' })

      return res.status(200).json({
        message: 'Zone retrieved successfully',
        zone: zoneData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const AddZone = async (
    req: express.Request<never, never, TFCCZoneType>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { name } = req.body

      const zoneData = new TFCCZoneModel({
        name,
      })
      await zoneData.save()

      return res.status(200).json({
        message: 'TFCC Zone added',
        zone: zoneData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const UpdateZone = async (
    req: express.Request<{ id: string }, never, TFCCZoneType>,
    res: express.Response
  ) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      let { name } = req.body

      const { id } = req.params

      const userDetails = await getUserDetails(req as any)

      // Check if Zone exists
      const existingZone: TFCCZoneDocumentType | null =
        await TFCCZoneModel.findById(id)

      if (!existingZone)
        return res.status(404).json({ message: 'Zone not found' })

      existingZone.name = name
      existingZone.updatedBy = userDetails.fullname

      await existingZone.save()

      return res.status(200).json({
        message: 'Zone updated successfully',
        zone: existingZone,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const DeleteZone = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find zone

      const zoneData = await TFCCZoneModel.findById(id)

      if (!zoneData) return res.status(404).json({ message: 'Zone not found' })

      await TFCCZoneModel.findByIdAndDelete(id)

      return res.status(200).json({
        message: 'Zone deleted Successfully',
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  return {
    GetAllZones,
    AddZone,
    ViewZone,
    UpdateZone,
    DeleteZone,
  }
}
