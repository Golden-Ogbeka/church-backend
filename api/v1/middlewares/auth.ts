import jwt from 'jsonwebtoken';
import AdminModel from '../models/admin.model';

export const isAdmin = async (value: string) => {
  try {
    // const token = value.split(' ')[1];
    const tokenData: any = jwt.verify(value, process.env.JWT_SECRET || '');

    if (!tokenData) throw 'Login to continue!';

    // Check if admin exists and is activated
    const isAdmin = await AdminModel.findOne({
      email: tokenData?.email,
      active: true,
    });

    if (!isAdmin) throw 'Unauthorized! Contact TFH Admin';

    return true;
  } catch (error) {
    throw error || 'Login to continue';
  }
};

export const isSuperAdmin = async (value: string) => {
  try {
    // const token = value.split(' ')[1];
    const tokenData: any = jwt.verify(value, process.env.JWT_SECRET || '');

    if (!tokenData) throw 'Login to continue!';

    // Check if admin exists, is super admin and is activated
    const isSuperAdmin = await AdminModel.findOne({
      email: tokenData?.email,
      active: true,
      role: 'superAdmin',
    });

    if (!isSuperAdmin)
      throw "You don't have permission to access this resource";
    return true;
  } catch (error) {
    throw error || 'Login to continue';
  }
};
