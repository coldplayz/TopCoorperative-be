/**
* Module for providing database services and logic for the Loan model.
* - must satisfy entity (core business rules) required interface
* - will be called by entity objects,
*   which will receive input data from controllers.
* - don't wrap in try/catch; let errors bubble up to controller.
*/

import { ApiError } from "@/lib/error-handling";
import { updateLoan } from "@/lib/utils";
import Loan from "@/src/models/loan.model";
import {
  RawLoanUpdateDTO,
  LoanCreateDTO,
  LoanQueryDTO,
  LoanUpdateDTO,
  LoanDoc,
} from "@/types";
// import { Document } from "mongoose";

export async function getLoans(queryObj: LoanQueryDTO) {
  return Loan.find(queryObj);
}

export async function getLoanById(id: string) {
  return Loan.findById(id);
}

export async function createLoan(loanData: LoanCreateDTO) {
  const newLoan = new Loan(loanData);
  await newLoan.save();

  return newLoan;
}

export async function editLoanById(id: string, updateObj: LoanUpdateDTO) {
  const existingLoan: LoanDoc | null = await Loan.findById(id);

  if (!existingLoan) {
    const error = new ApiError('Loan not found', 404);
    throw error;
  }

  const updatedLoan = updateLoan(existingLoan, updateObj);

  // console.log(id, updateObj); // SCAFF

  await updatedLoan.save();

  return updatedLoan;
}

export async function deleteLoanById(id: string) {
  const existingLoan = await Loan.findById(id);

  if (!existingLoan) {
    const error = new ApiError('Loan not found', 404);
    throw error;
  }

  await Loan.deleteOne({ _id: id });

  return {};
}
