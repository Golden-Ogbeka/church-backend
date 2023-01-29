import mongoosePaginate from 'mongoose-paginate-v2'
import { Schema, model, Document, PaginateModel } from 'mongoose'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  verificationCode: string
  dateOfBirth: string
  churchCenter: string
  member: boolean
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    verificationCode: { type: String, required: false },
    dateOfBirth: { type: String, required: true },
    churchCenter: { type: String, required: true },
    member: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
)

// Hide Password in responses
userSchema.methods.toJSON = function () {
  let obj = this.toObject()
  delete obj.password
  delete obj.verificationCode
  return obj
}

userSchema.plugin(mongoosePaginate)

const UserModel = model<IUser, PaginateModel<IUser>>('User', userSchema)

export default UserModel
