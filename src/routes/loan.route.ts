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
} from "@/src/controllers/loan.controller";
import { verifyJWT } from "@/src/middlewares/middleware";
import { AuthenticatedRequest } from "@/types";
import { Routes, routeAuthzMap } from "@/lib/config";

const loanRouter = Router();

// Get multiple loans
loanRouter.get(
  '/',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.loan.getLoans), // authZ
  getLoans
);

// Get one loan
loanRouter.get(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.loan.getLoanById), // authZ
  getLoanById
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
  editLoanById
);

// Delete a loan
loanRouter.delete(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.loan.deleteLoanById), // authZ
  deleteLoanById
);

export default loanRouter;
