import bcrypt from 'bcryptjs'
import { getUserDetails } from '../../../functions/auth'
import { UserType } from '../../../types/index'
import { getPaginationOptions } from '../../../utils/pagination'
import { validationResult } from 'express-validator'
import express from 'express'
import UserModel from '../../../models/user.model'
import { getDateFilters } from '../../../functions/filters'
import { sendEmail } from '../../../utils/mailer'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export default () => {
  const GetAllUsers = async (
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

      const paginationOptions = getPaginationOptions(req)

      // find all users

      const usersData = await UserModel.paginate(
        getDateFilters(req),
        paginationOptions
      )

      return res.status(200).json({
        message: 'All Users Retrieved',
        data: usersData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const ViewUser = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { id } = req.params

      // find user

      const userData = await UserModel.findById(id)

      if (!userData) return res.status(404).json({ message: 'User not found' })

      return res.status(200).json({
        message: 'User retrieved',
        user: userData,
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Authentication

  // Login an User into their Account
  const Login = async (
    req: express.Request<never, never, { email: string; password: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { email, password } = req.body

      // find user
      const existingUser = await UserModel.findOne({ email })
      if (!existingUser)
        return res.status(400).json({ message: 'Invalid email or password' })

      // compare passwords
      bcrypt.compare(password, existingUser.password, function (err, matched) {
        if (!matched)
          return res.status(400).json({ message: 'Invalid email or password' })

        // Generate JWT Token
        jwt.sign(
          existingUser.toJSON(),
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '2d' },
          (err, token) => {
            return res.status(200).json({
              message: 'Login successful',
              user: existingUser,
              token,
            })
          }
        )
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  interface RegistrationDetails {
    firstName: string
    lastName: string
    email: string
    password: string
    phoneNumber: string
    dateOfBirth: string
    churchCenter: string
    registrationSource: string
    member: boolean
  }

  const Register = async (
    req: express.Request<never, never, RegistrationDetails>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const {
        email,
        password,
        firstName,
        lastName,
        churchCenter,
        dateOfBirth,
        member,
        phoneNumber,
        registrationSource,
      } = req.body

      // check if user exists
      let existingUser = await UserModel.findOne({ email })
      if (existingUser && Object.keys(existingUser).length)
        return res.status(400).json({ message: 'User already exists' })

      // Hash password
      bcrypt.hash(password, 8, async function (err, hash) {
        // Store hash in your password DB.
        //Store new user
        let newUser: UserType = await UserModel.create({
          email,
          password: hash,
          firstName,
          lastName,
          churchCenter,
          dateOfBirth,
          phoneNumber,
          member,
          registrationSource,
        })

        return res.status(200).json({
          message: 'User created successfully',
          user: newUser,
        })
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  // Request Password Reset
  const ResetPasswordRequest = async (
    req: express.Request<never, never, { email: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { email } = req.body

      // check if user exists
      let existingUser = await UserModel.findOne({ email })
      if (!existingUser)
        return res.status(404).json({ message: 'User not found' })

      const verificationCode = crypto.randomUUID().substring(0, 5)

      existingUser.verificationCode = verificationCode

      existingUser.save()

      const emailToSend = {
        body: {
          greeting: 'Dear',
          name: existingUser?.firstName,
          intro:
            'You have received this email because a password reset request for your account was received.',
          action: {
            instructions: `Click the button below to reset your password or use <b>${verificationCode}</b> as your verification code :`,
            button: {
              color: '#DC4D2F',
              text: 'Reset password',
              fallback: true,
              link: `${
                process.env.ADMIN_DASHBOARD_URL || ''
              }/reset-password/update/${verificationCode}`,
            },
          },
          signature: 'Regards',
          outro:
            'If you did not request a password reset, no further action is required on your part.',
        },
      }

      sendEmail(email, 'Reset Password', emailToSend)

      return res.status(200).json({
        message: 'Reset password request successful',
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  const ResetPasswordUpdate = async (
    req: express.Request<
      never,
      never,
      { email: string; newPassword: string; verificationCode: string }
    >,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req)
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() })

      const { email, newPassword, verificationCode } = req.body

      // check if user exists
      let existingUser = await UserModel.findOne({ email, verificationCode })

      // Hash password
      bcrypt.hash(newPassword, 8, async function (err, hash) {
        if (!existingUser)
          return res
            .status(400)
            .json({ message: 'Invalid email or verification code' })

        const verificationCode = crypto.randomUUID().substring(0, 5)

        existingUser.password = hash
        existingUser.verificationCode = verificationCode //resetting the verification code also
        existingUser.save()

        const emailToSend = {
          body: {
            greeting: 'Dear',
            name: existingUser?.firstName,
            intro: 'You have successfully reset your password',
            signature: 'Regards',
            outro:
              'If you did not request a password reset, please contact TFH Admin.',
          },
        }

        sendEmail(email, 'Reset password update', emailToSend)

        return res.status(200).json({
          message: 'Password updated successfully',
        })
      })
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  }

  return {
    GetAllUsers,
    ViewUser,
    Login,
    Register,
    ResetPasswordRequest,
    ResetPasswordUpdate,
  }
}
