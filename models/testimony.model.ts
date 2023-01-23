import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface ITestimony extends Document {
	fullName: string; // the user's name
	summary: string; // like: Deliverance from Poverty
	content: string; // The testimony itself
	status: string;
	updatedBy: string; // The admin that changes the status
	source: string; // web or mobile
}

const testimonySchema = new Schema<ITestimony>(
	{
		fullName: { type: String, required: true },
		summary: { type: String, required: false },
		content: { type: String, required: true },
		status: {
			type: String,
			required: true,
			default: 'pending',
			lowercase: true,
			enum: ['pending', 'approved', 'declined', 'archived'], //these are the allowed statuses
		},
		updatedBy: { type: String, required: false },
		source: { type: String, required: true, enum: ['web', 'mobile'], default: 'web' },
	},
	{ timestamps: true }
);

testimonySchema.plugin(mongoosePaginate);

const TestimonyModel = model<ITestimony, PaginateModel<ITestimony>>(
	'Testimony',
	testimonySchema
);

export default TestimonyModel;
