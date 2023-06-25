import { UncertainObjectType } from '../../../types/index';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IEvent extends Document {
  name: string;
  theme: string; //Topic of event
  mainText: string; // Bible verse of event
  date: Date; // Event dates would be entered as desired. E.g: Every Tuesday in August
  time: string; // Time would also be entered as desired. E.g: 6pm on Tuesday, 8pm on Monday and Saturday
  allowRegistration: boolean;
  registrationEntries: UncertainObjectType[]; // each event would determine the data it aims to collect
  gallery: string[]; // Links to the images
  limitedNumberRegistration: boolean; // if the registration has a number limit
  registrationNumberLimit: number;
  limitedDateRegistration: boolean; // if the registration has a date limit
  registrationDateLimit: Date;
  // Event Image
  poster: string;
  requiredRegistrationDetails: UncertainObjectType[];
  eventType: string;
  description: string;
  location: string;
  createdBy: string;
  updatedBy: string;
}

const eventSchema = new Schema<IEvent>(
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

const EventModel = model<IEvent, PaginateModel<IEvent>>('Event', eventSchema);

// EventModel.paginate

export default EventModel;
