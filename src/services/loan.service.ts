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
import LoanReq from "@/src/models/request.model";
import { editUserById } from "@/src/services/user.service";

import {
  RawLoanUpdateDTO,
  LoanCreateDTO,
  LoanQueryDTO,
  LoanUpdateDTO,
  LoanDoc,
  RequestUser,
} from "@/types";
import { Types } from "mongoose";
// import { Document } from "mongoose";

const log = console.log; // SCAFF

export async function getLoans(
  queryObj: LoanQueryDTO,
  reqUser: RequestUser
) {
  if (reqUser.permissions.canReadOwn || reqUser.permissions.canReadAny) {
    // Get loans for the specific user.
    // TODO: optimize in a single db request, e.g. aggregation

    // First, get matching request IDs...
    const userReqObjs = await LoanReq.find({
      userId: new Types.ObjectId(reqUser.reqUserId),
    })
      .select({ _id: 1 })
      .lean();
    const userReqIds = userReqObjs.map((userReqObj) => userReqObj._id);

    // log(userReqIds, queryObj); // SCAFF

    // ...then, get matching loans
    /* Also works!
    const userLoans = await Loan.find({
      ...queryObj,
      requestId: { $in: userReqIds },
    });
    */
    const userLoans = await Loan.find(queryObj)
      .where('requestId').in(userReqIds);

    return userLoans;
  }

  if (reqUser.permissions.canReadAll) {
    return Loan.find(queryObj);
  }

  return [];
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

export async function payLoanById(id: string) {
  // First, update loan...
  const loan = await Loan.findById(id);

  if (!loan) {
    const error = new ApiError('Loan not found', 404);
    throw error;
  }

  loan.hasPaid = true;
  const updatedLoan = await loan.save();

  // ...then, update user to become loanable again
  const reqObj = await LoanReq
    .findById(loan.requestId)
    .select({ userId: 1 });

  if (!reqObj) {
    const error = new ApiError('Orphaned loan. No parent Request found.', 404);
    throw error;
  }

  await editUserById(reqObj.userId.toString(), { isLoanable: true });

  return updateLoan;
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
