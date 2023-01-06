import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  avatar: string;
  role: string;
  password: string;
  active: boolean
}


const userSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: false },
  role: { type: String, required: true, default: "admin" },
  password: { type: String, required: true },
  active: { type: Boolean, required: true, default: true },
}, { timestamps: true });

// Hide Password in responses
userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
}

const UserModel = model<IUser>('User', userSchema)

export default UserModel