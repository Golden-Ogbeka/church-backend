import bcrypt from 'bcryptjs';
import { getSQLUserDetails } from '../../../functions/auth';
import { AdminType } from '../../../types/index';
import { getPaginationOptions } from '../../../utils/pagination';
import { validationResult } from 'express-validator';
import express from 'express';
import {
  getDateFilters,
  getSequelizeDateFilters,
} from '../../../functions/filters';
import { sendEmail } from '../../../utils/mailer';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AdminModel, AdminModelAttributes } from '../models/admin';
import { getResponseVariables, paginate } from '../../../functions/pagination';

export default () => {
  const GetAllAdmins = async (
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

      // find all admins
      const adminsData = await AdminModel.findAndCountAll({
        order: [['id', 'ASC']],
        ...getSequelizeDateFilters({ from, to }),
        ...paginate({ limit, page }),
      });

      return res.status(200).json({
        message: 'All Admins Retrieved',
        data: getResponseVariables(adminsData, limit),
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  const AddAdmin = async (
    req: express.Request<never, never, AdminModelAttributes>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, password, fullname, role } = req.body;

      const userDetails = await getSQLUserDetails(req as any);

      // Check if admin exists

      let existingAdmin = await AdminModel.findOne({ where: { email } });
      if (existingAdmin && Object.keys(existingAdmin.toJSON()).length)
        return res.status(400).json({ message: 'Admin already exists' });

      // Hash password
      bcrypt.hash(password, 8, async function (err: any, hash: any) {
        // Store hash in your password DB.
        //Store new admin
        let newAdmin: AdminModelAttributes = await AdminModel.create({
          email,
          password: hash,
          fullname,
          role,
          createdBy: userDetails.fullname,
          updatedBy: userDetails.fullname,
        });

        return res.status(200).json({
          message: 'Admin created successfully',
          admin: {
            ...newAdmin.toJSON(),
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

  const ViewAdmin = async (
    req: express.Request<{ id: string }>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find admin

      const adminData = await AdminModel.findByPk(id);

      if (!adminData)
        return res.status(404).json({ message: 'Admin not found' });

      return res.status(200).json({
        message: 'Admin retrieved',
        admin: adminData,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  interface StatusBody extends AdminType {
    id: string;
    status: boolean;
  }
  const ChangeAdminStatus = async (
    req: express.Request<never, never, StatusBody>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id, status } = req.body;

      const userDetails = await getSQLUserDetails(req as any);

      const existingAdmin = await AdminModel.findByPk(id);
      if (!existingAdmin)
        return res.status(404).json({ message: 'Admin not found' });

      existingAdmin.active = status;
      existingAdmin.updatedBy = userDetails.fullname;

      await existingAdmin.save();

      return res.status(200).json({
        message: 'Admin updated successfully',
        admin: existingAdmin,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  interface BodyType extends AdminType {
    id: string;
  }
  const MakeSuperAdmin = async (
    req: express.Request<never, never, BodyType>,
    res: express.Response
  ) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.body;

      const userDetails = await getSQLUserDetails(req as any);

      const existingAdmin = await AdminModel.findByPk(id);
      if (!existingAdmin)
        return res.status(404).json({ message: 'Admin not found' });

      existingAdmin.role = 'superAdmin';
      existingAdmin.updatedBy = userDetails.fullname;

      await existingAdmin.save();

      return res.status(200).json({
        message: 'Admin updated successfully',
        admin: existingAdmin,
      });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: error?.message || 'Internal Server Error' });
    }
  };

  // Authentication
  // Login an Admin into their Account
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
      const existingAdmin = await AdminModel.findOne({
        where: { email },
        attributes: {
          include: ['password'],
        },
      });
      if (!existingAdmin)
        return res.status(400).json({ message: 'Invalid email or password' });

      // Check if admin is activated
      if (!existingAdmin.toJSON().active) {
        return res
          .status(400)
          .json({ message: 'Access Denied. Contact TFH Admin' });
      }

      // compare passwords
      bcrypt.compare(
        password,
        existingAdmin.toJSON().password,
        function (err, matched) {
          if (!matched)
            return res
              .status(400)
              .json({ message: 'Invalid email or password' });

          // Generate JWT Token
          jwt.sign(
            existingAdmin.toJSON(),
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '2d' },
            (err, token) => {
              return res.status(200).json({
                message: 'Login successful',
                user: {
                  ...existingAdmin.toJSON(),
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
      let existingAdmin = await AdminModel.findOne({ where: { email } });
      if (!existingAdmin)
        return res.status(404).json({ message: 'Admin not found' });

      const verificationCode = crypto.randomUUID().substring(0, 5);

      existingAdmin.verificationCode = verificationCode;

      existingAdmin.save();

      const emailToSend = {
        body: {
          greeting: 'Dear',
          name: existingAdmin?.fullname,
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
      let existingAdmin = await AdminModel.findOne({
        where: { email, verificationCode },
      });

      // Hash password
      bcrypt.hash(newPassword, 8, async function (err, hash) {
        if (!existingAdmin)
          return res
            .status(400)
            .json({ message: 'Invalid email or verification code' });

        const verificationCode = crypto.randomUUID().substring(0, 5);

        existingAdmin.password = hash;
        existingAdmin.verificationCode = verificationCode; //resetting the verification code also
        existingAdmin.save();

        const emailToSend = {
          body: {
            greeting: 'Dear',
            name: existingAdmin?.fullname,
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

  return {
    GetAllAdmins,
    AddAdmin,
    ViewAdmin,
    ChangeAdminStatus,
    MakeSuperAdmin,
    Login,
    ResetPasswordRequest,
    ResetPasswordUpdate,
  };
};
