const bcrypt = require('bcryptjs');
const { getUserDetails } = require('../../../functions/auth');
const { getPaginationOptions } = require('../../../utils/pagination');
const { validationResult } = require('express-validator');
const AdminModel = require('../models/admin.model');
const { getDateFilters } = require('../../../functions/filters');
const { sendEmail } = require('../../../utils/mailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Controller = () => {
  const GetAllAdmins = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const paginationOptions = getPaginationOptions(req);

      // find all admins

      const adminsData = await AdminModel.paginate(
        getDateFilters(req),
        paginationOptions
      );

      return res.status(200).json({
        message: 'All Admins Retrieved',
        data: adminsData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const AddAdmin = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, password, fullname } = req.body;

      const userDetails = await getUserDetails(req);

      // Check if admin exists

      let existingAdmin = await AdminModel.findOne({ email });
      if (existingAdmin && Object.keys(existingAdmin).length)
        return res.status(400).json({ message: 'Admin already exists' });

      // Hash password
      bcrypt.hash(password, 8, async function (err, hash) {
        // Store hash in your password DB.
        //Store new admin
        let newAdmin = await AdminModel.create({
          email,
          password: hash,
          fullname,
          createdBy: userDetails.fullname,
          updatedBy: userDetails.fullname,
        });

        return res.status(200).json({
          message: 'Admin created successfully',
          admin: newAdmin,
        });
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ViewAdmin = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.params;

      // find admin

      const adminData = await AdminModel.findById(id);

      if (!adminData)
        return res.status(404).json({ message: 'Admin not found' });

      return res.status(200).json({
        message: 'Admin retrieved',
        admin: adminData,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ChangeAdminStatus = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id, status } = req.body;

      const userDetails = await getUserDetails(req);

      const existingAdmin = await AdminModel.findById(id);
      if (!existingAdmin)
        return res.status(404).json({ message: 'Admin not found' });

      existingAdmin.active = status;
      existingAdmin.updatedBy = userDetails.fullname;

      await existingAdmin.save();

      return res.status(200).json({
        message: 'Admin updated successfully',
        admin: existingAdmin,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const MakeSuperAdmin = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { id } = req.body;

      const userDetails = await getUserDetails(req);

      const existingAdmin = await AdminModel.findById(id);
      if (!existingAdmin)
        return res.status(404).json({ message: 'Admin not found' });

      existingAdmin.role = 'superAdmin';
      existingAdmin.updatedBy = userDetails.fullname;

      await existingAdmin.save();

      return res.status(200).json({
        message: 'Admin updated successfully',
        admin: existingAdmin,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Authentication
  // Login an Admin into their Account
  const Login = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, password } = req.body;

      // find user
      const existingAdmin = await AdminModel.findOne({ email });
      if (!existingAdmin)
        return res.status(400).json({ message: 'Invalid email or password' });

      // Check if admin is activated
      if (!existingAdmin.active) {
        return res
          .status(400)
          .json({ message: 'Access Denied. Contact TFH Admin' });
      }

      // compare passwords
      bcrypt.compare(password, existingAdmin.password, function (err, matched) {
        if (!matched)
          return res.status(400).json({ message: 'Invalid email or password' });

        // Generate JWT Token
        jwt.sign(
          existingAdmin.toJSON(),
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '2d' },
          (err, token) => {
            return res.status(200).json({
              message: 'Login successful',
              user: existingAdmin,
              token,
            });
          }
        );
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  // Request Password Reset
  const ResetPasswordRequest = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email } = req.body;

      // check if user exists
      let existingAdmin = await AdminModel.findOne({ email });
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
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const ResetPasswordUpdate = async (req, res) => {
    try {
      // check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({ errors: errors.array() });

      const { email, newPassword, verificationCode } = req.body;

      // check if user exists
      let existingAdmin = await AdminModel.findOne({ email, verificationCode });

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
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
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

module.exports = Controller;
