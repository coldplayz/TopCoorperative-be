/**
* Module for providing database services and logic for the Request model.
* - must satisfy entity (core business rules) required interface
* - will be called by entity objects,
*   which will receive input data from controllers.
* - don't wrap in try/catch; let errors bubble up to controller.
*/

import { ApiError } from "@/lib/error-handling";
import { updateLoanReq } from "@/lib/utils";
import Request from "@/src/models/request.model";
import {
  RawRequestUpdateDTO,
  RequestCreateDTO,
  RequestQueryDTO,
  RequestUpdateDTO,
} from "@/types";
// import { Document } from "mongoose";

export async function getRequests(queryObj: RequestQueryDTO) {
  return Request.find(queryObj);
}

// export async function getAllRequests(queryObj: RequestQueryDTO  ) {}

export async function getRequestById(id: string) {
  return Request.findById(id);
}

export async function createRequest(requestData: RequestCreateDTO) {
  const newRequest = new Request(requestData);
  await newRequest.save();

  return newRequest;
}

// export async function createAnyRequest(requestData: RequestCreateDTO) {}

export async function editRequestById(id: string, updateObj: RequestUpdateDTO) {
  const existingRequest = await Request.findById(id);

  if (!existingRequest) {
    const error = new ApiError('Request not found', 404);
    throw error;
  }

  const updatedRequest = updateLoanReq(existingRequest, updateObj);

  // console.log(id, updateObj); // SCAFF

  await updatedRequest.save();

  return updatedRequest;
}

export async function deleteRequestById(id: string) {
  const existingRequest = await Request.findById(id);

  if (!existingRequest) {
    const error = new ApiError('Request not found', 404);
    throw error;
  }

  await Request.deleteOne({ _id: id });

  return {};
}
