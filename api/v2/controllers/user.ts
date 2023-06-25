import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import express from 'express';
import crypto from 'crypto';
import { getSequelizeDateFilters } from '../../../functions/filters';
import { sendEmail } from '../../../utils/mailer';
import { UserModel, UserModelAttributes } from '../models/user';
import { DepartmentModel } from '../models/department';
import { UnitModel } from '../models/unit';
import { getResponseVariables, paginate } from '../../../functions/pagination';
import { getTokenData } from '../../../functions/auth';

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
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { from, to, limit, page } = req.query;

      // find all users
      const usersData = await UserModel.findAndCountAll({
        include: [DepartmentModel, UnitModel],
        order: [['id', 'ASC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All Users Retrieved',
        data: getResponseVariables(usersData, limit),
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ViewUser = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find user
      const userData = await UserModel.findByPk(id);

      if (!userData) return res.status(404).json({ message: 'User not found' });

      return res.status(200).json({
        message: 'User retrieved',
        user: userData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  // Authentication

  // Login an User into their Account
  const Login = async (
    req: express.Request<never, never, { email: string; password: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, password } = req.body;

      // find user
      const existingUser = await UserModel.findOne({
        where: { email },
        attributes: {
          include: ['password'],
        },
      });
      if (!existingUser)
        return res.status(400).json({ message: 'Invalid email or password' });

      // compare passwords
      bcrypt.compare(
        password,
        existingUser.toJSON().password,
        function (err, matched) {
          if (!matched)
            return res
              .status(400)
              .json({ message: 'Invalid email or password' });

          // Generate JWT Token
          jwt.sign(
            existingUser.toJSON(),
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '2d' },
            (err, token) => {
              return res.status(200).json({
                message: 'Login successful',
                user: {
                  ...existingUser.toJSON(),
                  password: undefined,
                },
                token,
              });
            }
          );
        }
      );
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const Register = async (
    req: express.Request<never, never, UserModelAttributes>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const {
        email,
        password,
        fname,
        lname,
        churchCenter,
        dob,
        member,
        phone,
        registrationSource,
        titles,
        address,
        gender,
        marital,
      } = req.body;

      // check if user exists
      let existingUser = await UserModel.findOne({ where: { email } });
      if (existingUser && Object.keys(existingUser.toJSON()).length)
        return res.status(400).json({ message: 'User already exists' });

      // Hash password
      bcrypt.hash(password, 8, async function (err, hash) {
        // Store hash in your password DB.
        //Store new user
        let newUser: UserModelAttributes = await UserModel.create({
          email,
          password: hash,
          names: fname + ' ' + lname,
          fname,
          lname,
          churchCenter,
          dob,
          phone,
          member,
          registrationSource,
          titles,
          address,
          gender,
          marital,
        });

        return res.status(200).json({
          message: 'Registration successful',
          user: {
            ...newUser.toJSON(),
            password: undefined,
            verificationCode: undefined,
          },
        });
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  // Request Password Reset
  const ResetPasswordRequest = async (
    req: express.Request<never, never, { email: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email } = req.body;

      // check if user exists
      let existingUser = await UserModel.findOne({ where: { email } });
      if (!existingUser)
        return res.status(404).json({ message: 'User not found' });

      const verificationCode = crypto.randomUUID().substring(0, 5);

      existingUser.verificationCode = verificationCode;

      existingUser.save();

      const emailToSend = {
        body: {
          greeting: 'Dear',
          name: existingUser?.fname,
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
      };

      sendEmail(email, 'Reset Password', emailToSend);

      return res.status(200).json({
        message: 'Reset password request successful',
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

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
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, newPassword, verificationCode } = req.body;

      // check if user exists
      let existingUser = await UserModel.findOne({
        where: {
          email,
          verificationCode,
        },
      });

      // Hash password
      bcrypt.hash(newPassword, 8, async function (err, hash) {
        if (!existingUser)
          return res
            .status(400)
            .json({ message: 'Invalid email or verification code' });

        const verificationCode = crypto.randomUUID().substring(0, 5);

        existingUser.password = hash;
        existingUser.verificationCode = verificationCode; //resetting the verification code also
        existingUser.save();

        const emailToSend = {
          body: {
            greeting: 'Dear',
            name: existingUser?.fname,
            intro: 'You have successfully reset your password',
            signature: 'Regards',
            outro:
              'If you did not request a password reset, please contact TFH Admin.',
          },
        };

        sendEmail(email, 'Reset password update', emailToSend);

        return res.status(200).json({
          message: 'Password updated successfully',
        });
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const GetUserProfile = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const tokenData = getTokenData(req);

      const email = tokenData?.email;

      // find user
      const userData = await UserModel.findOne({
        where: {
          email,
        },
      });

      if (!userData) return res.status(404).json({ message: 'User not found' });

      return res.status(200).json({
        message: 'User profile retrieved',
        user: userData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const ChangeUserPassword = async (
    req: express.Request<
      never,
      never,
      {
        oldPassword: string;
        newPassword: string;
      }
    >,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const tokenData = getTokenData(req as any);
      const email = tokenData?.email;

      const { newPassword, oldPassword } = req.body;

      // Check if the passwords are the same
      if (oldPassword === newPassword)
        return res.status(400).json({
          message: 'New password must be different from old password',
        });

      // check if user exists
      let existingUser = await UserModel.findOne({
        where: {
          email,
        },
        attributes: {
          include: ['password'],
        },
      });

      if (!existingUser)
        return res.status(404).json({ message: 'User not found' });

      // compare passwords
      bcrypt.compare(
        oldPassword,
        existingUser.toJSON().password,
        function (err, matched) {
          if (!matched)
            return res
              .status(400)
              .json({ message: 'Old password is incorrect' });

          // Hash password
          bcrypt.hash(newPassword, 8, async function (err, hash) {
            existingUser!.password = hash;
            existingUser!.save();

            const emailToSend = {
              body: {
                greeting: 'Dear',
                name: existingUser?.fname,
                intro: 'You have successfully changed your password',
                signature: 'Regards',
                outro:
                  'If you did not change your password recently, please contact TFH Admin.',
              },
            };

            sendEmail(email, 'Password Updated', emailToSend);

            return res.status(200).json({
              message: 'Password updated successfully',
            });
          });
        }
      );
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const EditUserProfile = async (
    req: express.Request<never, never, UserModelAttributes>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const tokenData = getTokenData(req as any);
      const email = tokenData?.email;

      const {
        fname,
        lname,
        churchCenter,
        dob,
        member,
        phone,
        titles,
        address,
        gender,
        marital,
      } = req.body;

      // check if user exists
      let existingUser = await UserModel.findOne({ where: { email } });
      if (!existingUser)
        return res.status(400).json({ message: 'User not found' });

      existingUser.fname = fname || existingUser.fname;
      existingUser.lname = lname || existingUser.lname;
      existingUser.names =
        (fname || existingUser.fname) + ' ' + (lname || existingUser.lname);
      existingUser.churchCenter = churchCenter || existingUser.churchCenter;
      existingUser.dob = dob || existingUser.dob;
      existingUser.member = member || existingUser.member;
      existingUser.phone = phone || existingUser.phone;
      existingUser.titles = titles || existingUser.titles;
      existingUser.address = address || existingUser.address;
      existingUser.gender = gender || existingUser.gender;
      existingUser.marital = marital || existingUser.marital;

      await existingUser.save();

      return res.status(200).json({
        message: 'Profile updated',
        user: existingUser,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  return {
    GetAllUsers,
    ViewUser,
    Login,
    Register,
    ResetPasswordRequest,
    ResetPasswordUpdate,
    GetUserProfile,
    ChangeUserPassword,
    EditUserProfile,
  };
};
