const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema(
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
    registrationSource: {
      type: String,
      required: false,
      enum: ['web', 'mobile'],
      default: 'web',
    },
  },
  { timestamps: true }
);

// Hide Password in responses
userSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  delete obj.verificationCode;
  return obj;
};

userSchema.plugin(mongoosePaginate);

const UserModel = model('User', userSchema);

module.exports = UserModel;
