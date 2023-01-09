/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import express from 'express'
import UserModel from '../../../models/user.model';




export default () => {

  // Login an Admin into their Account
  const Login = async (req: express.Request<never, never, { email: string, password: string }>, res: express.Response) => {
    try {

      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

      const { email, password } = req.body

      // find user
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) return res.status(404).json({ message: "Invalid email or password" })

      // compare passwords
      bcrypt.compare(password, existingUser.password, function (err, matched) {
        if (!matched) return res.status(404).json({ message: "Invalid email or password" })

        // Generate JWT Token
        jwt.sign(existingUser.toJSON(), process.env.JWT_SECRET || "secret", { expiresIn: "2d" }, (err, token) => {
          return res.status(200).json({
            message: "Login successful",
            user: existingUser,
            token
          });
        })


      });


    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  interface RegistrationDetails {
    fullname: string;
    email: string;
    password: string;

  }

  const Register = async (req: express.Request<never, never, RegistrationDetails>, res: express.Response) => {
    try {

      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

      const { email, password, fullname } = req.body

      // check if user exists
      let existingUser = await UserModel.findOne({ email });
      if (existingUser && Object.keys(existingUser).length) return res.status(401).json({ message: "User already exists" });



      // Hash password
      bcrypt.hash(password, 8, async function (err, hash) {
        // Store hash in your password DB.
        //Store new user
        let newUser = await UserModel.create({
          email,
          password: hash,
          fullname,
        })

        return res.status(200).json({
          message: "User created successfully", user: newUser
        });

      });




    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };



  return {
    Login,
    Register
  };
};
