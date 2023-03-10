import { UncertainObjectType } from './../types/index'
import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface IAnnouncement extends Document {
  title: string
  details: string
  priority: number
  image: string
  description: string
  createdBy: string
  updatedBy: string
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    priority: { type: Number, required: true, default: 0 },
    details: { type: String, required: false },
    image: { type: String, required: true },
    description: { type: String, required: false },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  { timestamps: true }
)

announcementSchema.plugin(mongoosePaginate)

const AnnouncementModel = model<IAnnouncement, PaginateModel<IAnnouncement>>(
  'Announcement',
  announcementSchema
)

export default AnnouncementModel
