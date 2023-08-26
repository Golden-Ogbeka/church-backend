const jwt = require('jsonwebtoken');
const { AdminModel: SQLAdminModel } = require('../api/v2/models/admin');
const AdminModel = require('../api/v1/models/admin.model');

const getUserDetails = async (req) => {
  const authorization = req.headers.authorization;

  if (!authorization) throw new Error("User isn't valid");

  const tokenData = jwt.verify(authorization, process.env.JWT_SECRET || '');

  if (!tokenData) throw new Error(tokenData);

  const adminDetails = await AdminModel.findOne({
    email: tokenData?.email,
  });

  if (!adminDetails) throw new Error('Unauthorized!');

  return adminDetails;
};

const getTokenData = (req) => {
  const authorization = req.headers.authorization;

  if (!authorization) throw new Error("User isn't valid");

  const tokenData = jwt.verify(authorization, process.env.JWT_SECRET || '');

  return tokenData || null;
};

const getSQLUserDetails = async (req) => {
  const authorization = req.headers.authorization;

  if (!authorization) throw new Error("User isn't valid");

  const tokenData = jwt.verify(authorization, process.env.JWT_SECRET || '');

  if (!tokenData) throw new Error(tokenData);

  const adminDetails = await SQLAdminModel.findOne({
    where: {
      email: tokenData?.email,
    },
  });

  if (!adminDetails) throw new Error('Unauthorized!');

  return adminDetails.toJSON();
};

module.exports = {
  getSQLUserDetails,
  getTokenData,
  getUserDetails,
};
