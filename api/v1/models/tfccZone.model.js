const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const tfccZoneSchema = new Schema(
  {
    name: { type: String, required: true },
    updatedBy: { type: String, required: false },
  },
  { timestamps: true }
);

tfccZoneSchema.plugin(mongoosePaginate);

const TFCCZoneModel = model('TFCCZone', tfccZoneSchema);

module.exports = TFCCZoneModel;
