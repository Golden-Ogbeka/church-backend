import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';

export const isValidUser = async (value: string) => {
  try {
    // const token = value.split(' ')[1];
    const tokenData: any = jwt.verify(value, process.env.JWT_SECRET || '');

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
