import { Schema, model, Document, PaginateModel } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

export interface TFCCZoneDocumentType extends Document {
  name: string
  updatedBy: string
}

const tfccZoneSchema = new Schema<TFCCZoneDocumentType>(
  {
    name: { type: String, required: true },
    updatedBy: { type: String, required: false },
  },
  { timestamps: true }
)

tfccZoneSchema.plugin(mongoosePaginate)

const TFCCZoneModel = model<
  TFCCZoneDocumentType,
  PaginateModel<TFCCZoneDocumentType>
>('TFCCZone', tfccZoneSchema)

export default TFCCZoneModel
