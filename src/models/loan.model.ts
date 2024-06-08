/**
* Model for mapping to database.
* - Framework-specific to Mongoosejs
* - Database-specific to MongoDB
*/

import { Schema, model } from "mongoose";

const LoanSchema = new Schema({
  hasPaid: {
    type: Boolean,
    default: false,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  dueDate: {
    type: Date,
    required: 'You need to specify the deadline for loan repayment',
  },
  requestId: {
    type: 'ObjectId',
    ref: 'Request',
    required: true,
  },
}, {
  timestamps: true, // This adds createdAt and updatedAt fields
});

const Loan = model('Loan', LoanSchema);

export default Loan;
