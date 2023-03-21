import jwt from 'jsonwebtoken'
import AdminModel from '../models/admin.model'

export const isAdmin = async (value: string) => {
  try {
    // const token = value.split(' ')[1];
    const tokenData: any = jwt.verify(value, process.env.JWT_SECRET || '')

    if (!tokenData) throw new Error('Login to continue!')

    const isAdmin = await AdminModel.findOne({
      email: tokenData?.email,
    })

    if (!isAdmin) throw new Error('Unauthorized!')

    return true
  } catch (error) {
    throw new Error('Login to continue!')
  }
}
