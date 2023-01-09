/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import express from 'express'
import UserModel from '../../../models/user.model';
import { sendEmail } from '../../../utils/mailer';
import crypto from "crypto"


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

  // Request Password Reset
  const ResetPasswordRequest = async (req: express.Request<never, never, { email: string }>, res: express.Response) => {
    try {

      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

      const { email } = req.body

      // check if user exists
      let existingUser = await UserModel.findOne({ email });
      if (!existingUser) return res.status(404).json({ message: "User not found" })

      const verificationCode = crypto.randomUUID().substring(0, 5);

      existingUser.verificationCode = verificationCode;

      existingUser.save();

      const emailToSend = {
        body: {
          greeting: 'Dear',
          name: existingUser?.fullname,
          intro: 'You have received this email because a password reset request for your account was received.',
          action: {
            instructions: `Click the button below to reset your password or use ${verificationCode} as your verification code :`,
            button: {
              color: '#DC4D2F',
              text: "Reset password",
              fallback: true,
              link: `https://tfhconline.org.ng/reset-password-update?code=${verificationCode}`
            }
          },
          signature: "Regards",
          outro: 'If you did not request a password reset, no further action is required on your part.'
        }
      };

      sendEmail(email, "Reset Password", emailToSend)

      return res.status(200).json({
        message: "Reset password request successful",
      });

    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };


  return {
    Login,
    Register,
    ResetPasswordRequest
  };
};
