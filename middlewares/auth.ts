import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';


export const isAdmin = async (value: string) => {
  // const token = value.split(' ')[1];
  const tokenData: any = jwt.verify(value, process.env.JWT_SECRET || "");

  if (!tokenData) throw new Error(tokenData);

  const isAdmin = await UserModel.findOne({
    email: tokenData?.email
  }
  );
  if (!isAdmin) throw new Error('Unauthorized!');

  return true;

};