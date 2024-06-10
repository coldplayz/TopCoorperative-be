/**
* Module for providing database services and logic for the Request model.
* - must satisfy entity (core business rules) required interface
* - will be called by entity objects,
*   which will receive input data from controllers.
* - don't wrap in try/catch; let errors bubble up to controller.
*/

import { ApiError } from "@/lib/error-handling";
import { updateLoanReq } from "@/lib/utils";
import LoanReq from "@/src/models/request.model";
import User from "@/src/models/user.model";
import { getUserById } from "@/src/services/user.service";
import { createLoan, getLoanById } from "@/src/services/loan.service";
import {
  LoanCreateDTO,
  RawRequestUpdateDTO,
  RequestCreateDTO,
  RequestQueryDTO,
  RequestUpdateDTO,
  RequestUser,
} from "@/types";
import { Types } from "mongoose";
import { RequestStatuses } from "@/lib/config";
// import { Document } from "mongoose";

const log = console.log; // SCAFF

export async function getRequests(
  queryObj: RequestQueryDTO,
  reqUser: RequestUser
) {
  if (reqUser.permissions.canReadOwn || reqUser.permissions.canReadAny) {
    // Get requests with specified ID; use `/:id` route instead.
    const requests = await LoanReq.find({
      ...queryObj,
      userId: new Types.ObjectId(reqUser.reqUserId),
    });

    return requests;
  }

  if (reqUser.permissions.canReadAll) {
    // Get all as authorized
    return LoanReq.find(queryObj);
  }

  return [];
}

export async function getRequestById(id: string) {
  return LoanReq.findById(id);
}

export async function createRequest(requestData: RequestCreateDTO) {
  // Ensure the user is loanable
  const user = await getUserById(requestData.userId.toString());

  if (!user) {
    const error = new ApiError('User not found', 404);
    throw error;
  }

  if (!user.isLoanable) {
    const error = new ApiError(
      'Cannot create a new request. User has pending requests or unpaid loans',
      403
    );
    throw error;
  }

  const newRequest = new LoanReq(requestData);
  await newRequest.save();

  // Make the user not loanable until loan repaid, or request declined
  await User.updateOne(
    { _id: newRequest.userId },
    { $set: { isLoanable: false } }
  );

  return newRequest;
}

export async function editRequestById(id: string, updateObj: RequestUpdateDTO) {
  const existingRequest = await LoanReq.findById(id);

  if (!existingRequest) {
    const error = new ApiError('Request not found', 404);
    throw error;
  }

  const updatedRequest = updateLoanReq(existingRequest, updateObj);

  // console.log(id, updateObj); // SCAFF

  await updatedRequest.save();

  return updatedRequest;
}

export async function approveRequestById(id: string) {
  // First update request...
  const existingRequest = await LoanReq.findById(id);

  if (!existingRequest) {
    const error = new ApiError('Request not found', 404);
    throw error;
  }

  existingRequest.status = RequestStatuses.APPROVED;
  await existingRequest.save();

  // log(id, existingRequest); // SCAFF

  // ...then create a loan record for the approved request
  const now = new Date();
  const loanData: LoanCreateDTO = {
    dueDate: new Date(now.setMonth(now.getMonth() + existingRequest.tenure)),
    requestId: existingRequest._id,
  };
  const newLoan = await createLoan(loanData);

  return { existingRequest, newLoan };
}

export async function declineRequestById(id: string) {
  // First update request...
  const existingRequest = await LoanReq.findById(id);

  if (!existingRequest) {
    const error = new ApiError('Request not found', 404);
    throw error;
  }

  existingRequest.status = RequestStatuses.DECLINED;
  await existingRequest.save();

  // ...then make the user loanable again
  await User.updateOne(
    { _id: existingRequest.userId },
    { $set: { isLoanable: true } }
  );

  return existingRequest;
}

export async function deleteRequestById(id: string) {
  const existingRequest = await LoanReq.findById(id);

  if (!existingRequest) {
    const error = new ApiError('Request not found', 404);
    throw error;
  }

  // Ensure there is no loan linked to the request
  const linkedLoan = await getLoanById(existingRequest.userId.toString());

  if (linkedLoan) {
    const error = new ApiError(
      'Request cannot be deleted. Delete linked loan(s) first.',
      403
    );
    throw error;
  }

  await LoanReq.deleteOne({ _id: id });

  return {};
}
