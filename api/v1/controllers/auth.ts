/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import express from 'express'
import UserModel from '../../../models/user.model';



export default () => {
  // interface TypedRequestBody<T> extends Express.Request {
  //   body: T
  // }
  // Login an Admin into their Account
  const Login = async (req: express.Request<never, never, { email: string, password: string }>, res: express.Response) => {
    try {

      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

      const { email, password } = req.body

      // await UserModel.findone

      return res.status(200).json({
        email, password
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };



  return {
    Login,

  };
};
