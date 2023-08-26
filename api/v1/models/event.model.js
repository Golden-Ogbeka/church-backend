const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const eventSchema = new Schema(
  {
    name: { type: String, required: true },
    theme: { type: String, required: false },
    mainText: { type: String, required: false },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    allowRegistration: { type: Boolean, required: true, default: false },
    registrationEntries: { type: [], required: false },
    requiredRegistrationDetails: {
      type: [],
      required: false,
    },
    gallery: { type: [String], required: false },
    limitedNumberRegistration: {
      type: Boolean,
      required: true,
      default: false,
    },
    registrationNumberLimit: { type: Number, required: false },
    limitedDateRegistration: { type: Boolean, required: true, default: false },
    registrationDateLimit: { type: Date, required: false },
    eventType: { type: String, required: true, default: 'offline' },
    location: { type: String, required: false },
    description: { type: String, required: false },
    poster: { type: String, required: false },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  { timestamps: true }
);

eventSchema.plugin(mongoosePaginate);

// declare a mongoose document based on a Typescript interface representing your schema

const EventModel = model('Event', eventSchema);

// EventModel.paginate

module.exports = EventModel;
