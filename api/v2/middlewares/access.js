const jwt = require('jsonwebtoken');
const { AdminModel } = require('../models/admin');
const { UserModel } = require('../models/user');

const isValidUser = async (value) => {
  try {
    // const token = value.split(' ')[1];
    const tokenData = jwt.verify(value, process.env.JWT_SECRET || '');

    if (!tokenData) throw 'Login to continue!';

    // Check if admin exists, is super admin and is activated
    const isValidUser = await UserModel.findOne({
      where: {
        email: tokenData?.email,
      },
    });

    if (!isValidUser) throw "You don't have permission to access this resource";
    return true;
  } catch (error) {
    throw error || 'Login to continue';
  }
};

const isAdmin = async (value) => {
  try {
    // const token = value.split(' ')[1];
    const tokenData = jwt.verify(value, process.env.JWT_SECRET || '');

    if (!tokenData) throw 'Login to continue!';

    // Check if admin exists and is activated
    const isAdmin = await AdminModel.findOne({
      where: {
        email: tokenData?.email,
        active: true,
      },
    });

    if (!isAdmin) throw 'Unauthorized! Contact TFH Admin';

    return true;
  } catch (error) {
    throw error || 'Login to continue';
  }
};

const isSuperAdmin = async (value) => {
  try {
    // const token = value.split(' ')[1];
    const tokenData = jwt.verify(value, process.env.JWT_SECRET || '');

    if (!tokenData) throw 'Login to continue!';

    // Check if admin exists, is super admin and is activated
    const isSuperAdmin = await AdminModel.findOne({
      where: {
        email: tokenData?.email,
        active: true,
        role: 'superAdmin',
      },
    });

    if (!isSuperAdmin)
      throw "You don't have permission to access this resource";
    return true;
  } catch (error) {
    throw error || 'Login to continue';
  }
};

module.exports = {
  isValidUser,
  isAdmin,
  isSuperAdmin,
};
