/**
* Model for mapping to database.
* - Framework-specific to Mongoosejs
* - Database-specific to MongoDB
*/

import { RequestStatuses } from "@/lib/config";
import { Schema, model } from "mongoose";

const RequestSchema = new Schema({
  amountRequested: {
    type: Number,
    required: [true, 'The requested loan amount must be provided.'],
  },
  status: {
    type: String,
    enum: [...Object.values(RequestStatuses)],
    default: RequestStatuses.PENDING,
  },
  tenure: {
    type: Number, // time before repayment due, in months
    required: true,
  },
  amountRepayable: {
    type: Number, // to the nearest Naira
    required: true,
  },
  userId: {
    type: 'ObjectId',
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt fields
});

const Request = model('Request', RequestSchema);

export default Request;
