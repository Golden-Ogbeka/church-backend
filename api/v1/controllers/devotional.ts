import { getUserDetails } from './../../../functions/auth';
import { DevotionalType } from './../../../types/index';
import { getPaginationOptions } from './../../../utils/pagination';
import { validationResult } from 'express-validator';
import express from 'express'
import DevotionalModel from '../../../models/devotional.model';
import { getDateFilters } from '../../../functions/filters';

export default () => {
  const GetAllDevotionals = async (req: express.Request<never, never, never, { page: number, limit: number, from: string, to: string }>, res: express.Response) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

      const paginationOptions = getPaginationOptions(req)

      // find all devotionals
      const devotionalsData = await DevotionalModel.paginate(getDateFilters(req), paginationOptions);

      return res.status(200).json({
        message: "All Devotionals Retrieved",
        data: devotionalsData
      });

    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const AddDevotional = async (req: express.Request<never, never, DevotionalType>, res: express.Response) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

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
        createdBy: userDetails.fullname
      })

      await newDevotional.save()

      return res.status(200).json({
        message: "Devotional added successfully",
        devotional: newDevotional
      });

    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    GetAllDevotionals,
    AddDevotional
  };
};
