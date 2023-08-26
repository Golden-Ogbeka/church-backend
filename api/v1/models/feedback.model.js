const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const feedbackSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    content: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: 'unread',
      lowercase: true,
      enum: ['read', 'unread'], //these are the allowed statuses
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

feedbackSchema.plugin(mongoosePaginate);

const FeedbackModel = model('Feedback', feedbackSchema);

module.exports = FeedbackModel;
