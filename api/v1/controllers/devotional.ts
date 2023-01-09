/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import express from 'express'
import DevotionalModel from '../../../models/devotional.model';


export default () => {
  const GetAllDevotionals = async (req: express.Request, res: express.Response) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

      // find all devotionals
      const allDevotionals = await DevotionalModel.find();

      return res.status(200).json({
        message: "All Devotionals Retrieved",
        devotionals: allDevotionals
      });

    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    GetAllDevotionals,
  };
};
