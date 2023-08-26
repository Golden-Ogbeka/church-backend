const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const announcementSchema = new Schema(
  {
    title: { type: String, required: true },
    priority: { type: Number, required: true, default: 0 },
    details: { type: String, required: false },
    image: { type: String, required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  { timestamps: true }
);

announcementSchema.plugin(mongoosePaginate);

const AnnouncementModel = model('Announcement', announcementSchema);

module.exports = AnnouncementModel;
