import {
  Router,
  Request,
  Response,
  NextFunction,
} from "express";
import {  } from "mongoose";

import {
  getRequests,
  getRequestById,
  createRequest,
  editRequestById,
  deleteRequestById,
} from "@/src/controllers/request.controller";
import { verifyJWT } from "@/src/middlewares/middleware";
import { AuthenticatedRequest } from "@/types";

const requestRouter = Router();

// Get multiple requests
requestRouter.get('/', verifyJWT, getRequests);

// Get one request
requestRouter.get('/:id', verifyJWT, getRequestById);

// Create new request
requestRouter.post(
  '/',
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    createRequest(req as AuthenticatedRequest, res, next);
  }
);

// Update a request
requestRouter.put('/:id', verifyJWT, editRequestById);

// Delete a request
requestRouter.delete('/:id', verifyJWT, deleteRequestById);

export default requestRouter;
