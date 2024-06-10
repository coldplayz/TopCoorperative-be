/**
* Formats use-case input and output.
* - ensures input data is in the form the
*   application-specific business rules/logic want it.
* - will pass dependencies to be injected to use cases,
*   thus knowing about and depending on their import.
*/

import {Request, Response, NextFunction} from "express";

import * as userService from "@/src/services/user.service";
import * as loanService from "@/src/services/loan.service";
import eventEmitter from "../events/api-events";
import {
  AuthenticatedRequest,
  DecodedAccessToken,
  LoanCreateDTO,
  LoanQueryDTO,
  LoanUpdateDTO,
} from "@/types";
import {
  getLoanDataFrom,
  getLoanQueryFrom,
  getLoanReqDataFrom,
  getLoanReqQueryFrom,
  getLoanReqUpdateFrom,
  getLoanUpdateFrom,
} from "@/lib/utils";
import { Types } from "mongoose";

// TODO:
// - see about decoupling controller from data service; perhaps
//   moving dependency injection to the main entry point - index.ts
// - data validation
// - data formatting
// - see about matching request [param] id with...
//   auth user id during authorization for ops like editing and deleting.

export async function getLoans(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  /*
  if (!req.user.reqUserId && !req.user.permissions.canReadAll) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized to access other users data',
    });
  };
  */

  const queryObj: LoanQueryDTO = getLoanQueryFrom(
    req.query,
  );

  try {
    const loans = await loanService.getLoans(
      queryObj,
      req.user
    );
    res.json({
      success: true,
      data: loans,
    });
    eventEmitter.emit('getLoans', { getLoans: true, loans });
  } catch (err: any) {
    next(err);
  }
}

export async function getLoanById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  try {
    const loan = await loanService.getLoanById(id);
    res.json({
      success: true,
      data: loan,
    });
    eventEmitter.emit('getLoanById', { getLoanById: true, loan });
  } catch (err: any) {
    next(err);
  }
}

export async function createLoan(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const loanData: LoanCreateDTO = getLoanDataFrom(
    req.body,
    req.user.id
  );

  try {
    const newLoan = await loanService.createLoan(loanData);
    res.status(201).json({
      success: true,
      data: newLoan,
    });
    eventEmitter.emit('createLoan', { createLoan: true, newLoan });
  } catch (err: any) {
    next(err);
  }
}

export async function editLoanById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const updateData: LoanUpdateDTO = getLoanUpdateFrom(req.body);

  // console.log(updateData, req.body); // SCAFF

  try {
    const updatedLoan = await loanService.editLoanById(id, updateData);
    res.json({
      success: true,
      data: updatedLoan,
    });
    eventEmitter.emit('editLoanById', {
      editLoanById: true,
      updatedLoan,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function payLoanById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const paidLoan = await loanService.payLoanById(req.params.id);
    res.json({
      success: true,
      data: paidLoan,
    });
  } catch (err: any) {
    next(err);
  }
}

export async function deleteLoanById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  try {
    const result = await loanService.deleteLoanById(id);
    res.status(204).json({ success: true, result });
    eventEmitter.emit('deleteLoanById', { data: {} });
  } catch (err: any) {
    next(err);
  }
}
