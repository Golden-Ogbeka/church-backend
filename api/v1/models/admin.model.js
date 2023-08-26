const mongoosePaginate = require('mongoose-paginate-v2');
const { Schema, model } = require('mongoose');

const adminSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, required: false },
    role: { type: String, required: true, default: 'admin' },
    password: { type: String, required: true },
    active: { type: Boolean, required: true, default: true },
    verificationCode: { type: String, required: false },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  { timestamps: true }
);

// Hide Password in responses
adminSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  delete obj.verificationCode;
  return obj;
};

adminSchema.plugin(mongoosePaginate);

const AdminModel = model('Admin', adminSchema);

module.exports = AdminModel;
