import {
  Router,
  Request,
  Response,
  NextFunction,
} from "express";
import {  } from "mongoose";

import {
  getLoans,
  getLoanById,
  createLoan,
  editLoanById,
  deleteLoanById,
  payLoanById,
} from "@/src/controllers/loan.controller";
import { verifyJWT } from "@/src/middlewares/authn-middleware";
import { AuthenticatedRequest } from "@/types";
import { Routes, routeAuthzMap } from "@/lib/config";

const loanRouter = Router();

// Get multiple loans
loanRouter.get(
  '/',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.loan.getLoans), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    getLoans(req as AuthenticatedRequest, res, next);
  }
);

// Get one loan
loanRouter.get(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.loan.getLoanById), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    getLoanById(req as AuthenticatedRequest, res, next);
  }
);

// Create new loan
loanRouter.post(
  '/',
  verifyJWT,
  routeAuthzMap.get(Routes.loan.createLoan), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    createLoan(req as AuthenticatedRequest, res, next);
  }
);

// Update a loan
loanRouter.put(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.loan.editLoanById), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    editLoanById(req as AuthenticatedRequest, res, next);
  }
);

// Pay a loan
loanRouter.put(
  Routes.loan.payLoanById.path,
  verifyJWT,
  routeAuthzMap.get(Routes.loan.payLoanById), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    payLoanById(req as AuthenticatedRequest, res, next);
  }
);

// Delete a loan
loanRouter.delete(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.loan.deleteLoanById), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    deleteLoanById(req as AuthenticatedRequest, res, next);
  }
);

export default loanRouter;
