import express from 'express';
import jwt from 'jsonwebtoken';
import AdminModel from '../api/v1/models/admin.model';

export const getUserDetails = async (req: express.Request) => {
  const authorization = req.headers.authorization;

  if (!authorization) throw new Error("User isn't valid");

  const tokenData: any = jwt.verify(
    authorization,
    process.env.JWT_SECRET || ''
  );

  if (!tokenData) throw new Error(tokenData);

  const adminDetails = await AdminModel.findOne({
    email: tokenData?.email,
  });

  if (!adminDetails) throw new Error('Unauthorized!');

  return adminDetails;
};

export const getTokenData = (req: express.Request) => {
  const authorization = req.headers.authorization;

  if (!authorization) throw new Error("User isn't valid");

  const tokenData: any = jwt.verify(
    authorization,
    process.env.JWT_SECRET || ''
  );

  return tokenData || null;
};
