/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import express from 'express'


export default () => {
  // Login an Admin into their Account
  const Login = async (req: express.Request, res: express.Response) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });


      return res.status(200).json({

      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };



  return {
    Login,

  };
};
