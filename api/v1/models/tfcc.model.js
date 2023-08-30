const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const tfccSchema = new Schema(
  {
    address: { type: String, required: true },
    cellLeader: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    zone: { type: String, required: false },
    updatedBy: { type: String, required: false },
  },
  { timestamps: true }
);

tfccSchema.plugin(mongoosePaginate);

const TFCCModel = model('TFCC', tfccSchema);

module.exports = TFCCModel;
