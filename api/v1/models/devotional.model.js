const { Schema, model, Document, PaginateModel } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const devotionalSchema = new Schema(
  {
    date: { type: Date, required: true, unique: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    mainText: { type: String, required: true },
    content: { type: String, required: true },
    confession: { type: String, required: true },
    furtherReading: { type: [String], required: true },
    oneYearBibleReading: { type: [String], required: true },
    twoYearsBibleReading: { type: [String], required: true },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
    views: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

devotionalSchema.plugin(mongoosePaginate);

// declare a mongoose document based on a Typescript interface representing your schema

const DevotionalModel = model('Devotional', devotionalSchema);

// DevotionalModel.paginate

module.exports = DevotionalModel;
