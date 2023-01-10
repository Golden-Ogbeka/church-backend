import { getPaginationOptions } from './../../../utils/pagination';
/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import express from 'express'
import DevotionalModel from '../../../models/devotional.model';

export default () => {
  const GetAllDevotionals = async (req: express.Request<never, never, never, { page: number, limit: number }>, res: express.Response) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

      const paginationOptions = getPaginationOptions(req)

      // find all devotionals
      const devotionalsData = await DevotionalModel.paginate({}, paginationOptions);

      return res.status(200).json({
        message: "All Devotionals Retrieved",
        data: devotionalsData
      });

    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    GetAllDevotionals,
  };
};
