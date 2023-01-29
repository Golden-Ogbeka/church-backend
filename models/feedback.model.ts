import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface IFeedback extends Document {
  fullName: string // the user's name
  email: string //the user's email
  phoneNumber: string // the user's phone number
  content: string // The feedback itself
  status: string // read or unread
  updatedBy: string // The admin that changes the status
  source: string // web or mobile
}

const feedbackSchema = new Schema<IFeedback>(
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
)

feedbackSchema.plugin(mongoosePaginate)

const FeedbackModel = model<IFeedback, PaginateModel<IFeedback>>(
  'Feedback',
  feedbackSchema
)

export default FeedbackModel
