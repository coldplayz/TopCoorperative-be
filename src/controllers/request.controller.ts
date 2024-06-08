/**
* Formats use-case input and output.
* - ensures input data is in the form the
*   application-specific business rules/logic want it.
* - will pass dependencies to be injected to use cases,
*   thus knowing about and depending on their import.
*/

import {Request, Response, NextFunction} from "express";

import * as userService from "@/src/services/user.service";
import * as requestService from "@/src/services/request.service";
import eventEmitter from "../events/api-events";
import {
  DecodedAccessToken,
  RequestCreateDTO,
  RequestQueryDTO,
  RequestUpdateDTO,
} from "@/types";
import {
  getLoanReqDataFrom,
  getLoanReqQueryFrom,
  getLoanReqUpdateFrom,
} from "@/lib/utils";

// TODO:
// - see about decoupling controller from data service; perhaps
//   moving dependency injection to the main entry point - index.ts
// - data validation
// - data formatting
// - see about matching request [param] id with...
//   auth user id during authorization for ops like editing and deleting.

export async function getRequests(req: Request, res: Response, next: NextFunction) {
  const queryObj: RequestQueryDTO = getLoanReqQueryFrom(req.query);

  try {
    const requests = await requestService.getRequests(queryObj);
    res.json({
      success: true,
      data: requests,
    });
    eventEmitter.emit('getRequests', { getRequests: true, requests });
  } catch (err: any) {
    // res.status(err.statusCode || 500).json({ success: false, error: err });
    next(err);
  }
}

export async function getRequestById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const request = await requestService.getRequestById(id);
    res.json({
      success: true,
      data: request,
    });
    eventEmitter.emit('getRequestById', { getRequestById: true, request });
  } catch (err: any) {
    // res.status(err.statusCode || 500).json({ success: false, error: err });
    next(err);
  }
}

export async function createRequest(
  req: Request & { user: DecodedAccessToken },
  res: Response,
  next: NextFunction
) {
  const requestData: RequestCreateDTO = getLoanReqDataFrom(
    req.body,
    req.user.id
  );

  try {
    const newRequest = await requestService.createRequest(requestData);
    res.status(201).json({
      success: true,
      data: newRequest,
    });
    eventEmitter.emit('createRequest', { createRequest: true, newRequest });
  } catch (err: any) {
    // res.status(err.statusCode || 500).json({ success: false, error: err });
    next(err);
  }
}

export async function editRequestById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const updateData: RequestUpdateDTO = getLoanReqUpdateFrom(req.body);

  // console.log(updateData, req.body); // SCAFF

  try {
    const updatedRequest = await requestService.editRequestById(id, updateData);
    res.json({
      success: true,
      data: updatedRequest,
    });
    eventEmitter.emit('editRequestById', {
      editRequestById: true,
      updatedRequest,
    });
  } catch (err: any) {
    // res.status(err.statusCode || 500).json({ success: false, error: err });
    next(err);
  }
}

export async function deleteRequestById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const result = await requestService.deleteRequestById(id);
    res.status(204).json({ success: true, result });
    eventEmitter.emit('deleteRequestById', { data: {} });
  } catch (err: any) {
    // res.status(err.statusCode || 500).json({ success: false, error: err });
    next(err);
  }
}
