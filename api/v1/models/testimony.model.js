const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const testimonySchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    summary: { type: String, required: false },
    content: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: 'pending',
      lowercase: true,
      enum: ['pending', 'approved', 'declined', 'archived'], //these are the allowed statuses
    },
    updatedBy: { type: String, required: false },
    source: {
      type: String,
      required: true,
      enum: ['web', 'mobile'],
      default: 'web',
    },
  },
  { timestamps: true }
);

testimonySchema.plugin(mongoosePaginate);

const TestimonyModel = model('Testimony', testimonySchema);

module.exports = TestimonyModel;
