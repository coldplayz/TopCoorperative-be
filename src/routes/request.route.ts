import {
  Router,
  Request,
  Response,
  NextFunction,
} from "express";
import {  } from "mongoose";

import {
  approveRequestById,
  declineRequestById,
  getRequests,
  getRequestById,
  createRequest,
  editRequestById,
  deleteRequestById,
} from "@/src/controllers/request.controller";
import { verifyJWT } from "@/src/middlewares/authn-middleware";
import { Routes, routeAuthzMap } from "@/lib/config";
import { AuthenticatedRequest } from "@/types";

const requestRouter = Router();

// Get multiple requests
requestRouter.get(
  '/',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.request.getRequests), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    getRequests(req as AuthenticatedRequest, res, next);
  }
);

// Get one request
requestRouter.get(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.request.getRequestById), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    getRequestById(req as AuthenticatedRequest, res, next);
  }
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
  (req: Request, res: Response, next: NextFunction) => {
    editRequestById(req as AuthenticatedRequest, res, next);
  }
);

// Approve a request
requestRouter.put(
  Routes.request.approveRequestById.path,
  verifyJWT,
  routeAuthzMap.get(Routes.request.approveRequestById), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    approveRequestById(req as AuthenticatedRequest, res, next);
  }
);

// Decline a request
requestRouter.put(
  Routes.request.declineRequestById.path,
  verifyJWT,
  routeAuthzMap.get(Routes.request.declineRequestById), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    declineRequestById(req as AuthenticatedRequest, res, next);
  }
);

// Delete a request
requestRouter.delete(
  '/:id',
  verifyJWT,
  routeAuthzMap.get(Routes.request.deleteRequestById), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    deleteRequestById(req as AuthenticatedRequest, res, next);
  }
);

export default requestRouter;
