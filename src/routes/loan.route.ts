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

const loanRouter = Router();

// Get multiple loans
loanRouter.get('/', verifyJWT, getLoans);

// Get one loan
loanRouter.get('/:id', verifyJWT, getLoanById);

// Create new loan
loanRouter.post(
  '/',
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    createLoan(req as AuthenticatedRequest, res, next);
  }
);

// Update a loan
loanRouter.put('/:id', verifyJWT, editLoanById);

// Delete a loan
loanRouter.delete('/:id', verifyJWT, deleteLoanById);

export default loanRouter;
