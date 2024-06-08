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
import { Routes, routeAuthzMap } from "@/lib/config";
import { AuthenticatedRequest } from "@/types";

const requestRouter = Router();

// Get multiple requests
requestRouter.get(
  '/',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.request.getRequests), // authZ
  getRequests
);

// Get one request
requestRouter.get(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.request.getRequestById), // authZ
  getRequestById
);

// Create new request
requestRouter.post(
  '/',
  verifyJWT,
  routeAuthzMap.get(Routes.request.createRequest), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    createRequest(req as AuthenticatedRequest, res, next);
  }
);

// Update a request
requestRouter.put(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.request.editRequestById), // authZ
  editRequestById
);

// Delete a request
requestRouter.delete(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.request.deleteRequestById), // authZ
  deleteRequestById
);

export default requestRouter;
