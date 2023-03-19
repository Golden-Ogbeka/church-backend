import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface TFFDocumentType extends Document {
  address: string
  cellLeader: string
  phoneNumber: string
  zone: string
  updatedBy: string
}

const tfccSchema = new Schema<TFFDocumentType>(
  {
    address: { type: String, required: true },
    cellLeader: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    zone: { type: String, required: false },
    updatedBy: { type: String, required: false },
  },
  { timestamps: true }
)

tfccSchema.plugin(mongoosePaginate)

const TFCCModel = model<TFFDocumentType, PaginateModel<TFFDocumentType>>(
  'TFCC',
  tfccSchema
)

export default TFCCModel
