import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

import {
  LoanCreateDTO,
  LoanDoc,
  LoanQueryDTO,
  LoanUpdateDTO,
  RawLoanCreateDTO,
  RawLoanQueryDTO,
  RawLoanUpdateDTO,
  RawRequestCreateDTO,
  RawRequestQueryDTO,
  RawRequestUpdateDTO,
  RawUserCreateDTO,
  RawUserQueryDTO,
  RawUserUpdateDTO,
  RequestCreateDTO,
  RequestDoc,
  RequestQueryDTO,
  RequestUpdateDTO,
  UserCreateDTO,
  UserDoc,
  ReqUserPermissions,
  UserQueryDTO,
  UserUpdateDTO,
} from "@/types";

const log = console.log; // SCAFF

/**
* Given a loan request object, updates it for saving to db.
*/
export function updateLoanReq(request: RequestDoc, updateObj: RequestUpdateDTO) {
  const q = updateObj;

  if (q.amountRequested) request.amountRequested = q.amountRequested;
  if (q.status) request.status = q.status;
  if (q.tenure) request.tenure = q.tenure;
  if (q.amountRepayable) request.amountRepayable = q.amountRepayable;

  return request;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getLoanReqUpdateFrom(req: RawRequestUpdateDTO) {
  const q = req;
  const updateObj: RequestUpdateDTO = {};

  if (q.amountRequested) updateObj.amountRequested = parseInt(q.amountRequested);
  if (q.status) updateObj.status = q.status;
  if (q.tenure) updateObj.tenure = parseInt(q.tenure);
  if (q.amountRepayable) updateObj.amountRepayable = parseInt(q.amountRepayable);

  return updateObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getLoanReqQueryFrom(
  req: RawRequestQueryDTO,
) {
  const q = req;
  const queryObj: RequestQueryDTO = {};

  if (q.amountRequested) queryObj.amountRequested = parseInt(q.amountRequested);
  if (q.status) queryObj.status = q.status;
  if (q.tenure) queryObj.tenure = parseInt(q.tenure);
  if (q.amountRepayable) queryObj.amountRepayable = parseInt(q.amountRepayable);
  if (q.userId) queryObj.userId = new Types.ObjectId(q.userId);
  if (q.createdAt) queryObj.createdAt = new Date(q.createdAt);
  if (q.updatedAt) queryObj.updatedAt = new Date(q.updatedAt);

  return queryObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getLoanReqDataFrom(req: RawRequestCreateDTO, userID: string) {
  const q = req;

  const amountRequested = parseInt(q.amountRequested);
  const tenure = parseInt(q.tenure);
  const amountRepayable = parseInt(q.amountRepayable);
  const userId = new Types.ObjectId(userID);

  const reqData: RequestCreateDTO = {
    amountRequested,
    amountRepayable,
    tenure,
    userId,
  };

  return reqData;
};

// ======= Loans =======

/**
* Given a loan object, updates it for saving to db.
*/
export function updateLoan(loan: LoanDoc, updateObj: LoanUpdateDTO) {
  const q = updateObj;

  if (q.amountPaid) loan.amountPaid = q.amountPaid;
  if (q.dueDate) loan.dueDate = q.dueDate;
  if (q.hasPaid != null) loan.hasPaid = q.hasPaid;

  return loan;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getLoanUpdateFrom(req: RawLoanUpdateDTO) {
  const q = req;
  const updateObj: LoanUpdateDTO = {};

  if (q.amountPaid) updateObj.amountPaid = parseInt(q.amountPaid);
  if (q.dueDate) updateObj.dueDate = new Date(q.dueDate);
  log(req); // SCAFF
  if (q.hasPaid != null) updateObj.hasPaid = toBool(q.hasPaid);
  log(updateObj); // SCAFF

  return updateObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getLoanQueryFrom(
  req: RawLoanQueryDTO,
) {
  const q = req;
  const queryObj: LoanQueryDTO = {};

  if (q.amountPaid) queryObj.amountPaid = parseInt(q.amountPaid);
  if (q.dueDate) queryObj.dueDate = new Date(q.dueDate);
  if (q.hasPaid != null) queryObj.hasPaid = toBool(q.hasPaid);
  if (q.requestId) queryObj.requestId = new Types.ObjectId(q.requestId);
  if (q.createdAt) queryObj.createdAt = new Date(q.createdAt);
  if (q.updatedAt) queryObj.updatedAt = new Date(q.updatedAt);

  return queryObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getLoanDataFrom(req: RawLoanCreateDTO, userId: string) {
  const q = req;

  const dueDate = new Date(q.dueDate);
  const requestId = new Types.ObjectId(q.requestId);

  const reqData: LoanCreateDTO = {
    dueDate,
    requestId,
  };

  return reqData;
};

// ======= Users =======

/**
* Given a user object, updates it for saving to db.
*/
export function updateUser(user: UserDoc, updateObj: UserUpdateDTO) {
  const q = updateObj;

  if (q.email) user.email = q.email;
  if (q.firstName) user.firstName = q.firstName;
  if (q.lastName) user.lastName = q.lastName;
  if (q.role) user.role = q.role;
  if (q.isLoanable) user.isLoanable = q.isLoanable;

  return user;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getUserUpdateFrom(req: RawUserUpdateDTO) {
  const q = req;
  const updateObj: UserUpdateDTO = {};

  if (q.email) updateObj.email = q.email;
  if (q.firstName) updateObj.firstName = q.firstName;
  if (q.lastName) updateObj.lastName = q.lastName;
  if (q.role) updateObj.role = q.role;
  if (q.isLoanable != null) updateObj.isLoanable = toBool(q.isLoanable);

  return updateObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getUserQueryFrom(req: RawUserQueryDTO) {
  const q = req;
  const queryObj: UserQueryDTO = {};

  if (q.email) queryObj.email = q.email;
  if (q.firstName) queryObj.firstName = q.firstName;
  if (q.lastName) queryObj.lastName = q.lastName;
  if (q.role) queryObj.role = q.role;
  if (q.isLoanable != null) queryObj.isLoanable = toBool(q.isLoanable);
  if (q.createdAt) queryObj.createdAt = new Date(q.createdAt);
  if (q.updatedAt) queryObj.updatedAt = new Date(q.updatedAt);

  return queryObj;
};

/**
* Give an HTTP request query or body, return an object of the
* non-nullish properties coerced to their db data types.
*/
export function getUserDataFrom(req: RawUserCreateDTO) {
  const q = req;

  const email = q.email;
  const firstName = q.firstName;
  const lastName = q.lastName;
  const password = q.password;
  const role = q.role;

  const reqData: UserCreateDTO = {
    email,
    firstName,
    lastName,
    password,
    role,
  };

  return reqData;
};

/**
 * Coverts true and false, as string, to boolean.
 */
function toBool(inp: boolean | string) {
  if (inp === 'true' || inp === true) return true;
  if (inp === 'false' || inp === false) return false;

  throw new Error('Arg must be true or false, as boolean or string literals.');
}
