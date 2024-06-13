import { NextFunction, Request, Response, Router } from "express";

import {
  getUsers,
  getUserById,
  createUser,
  editUserById,
  deleteUserById,
  getMe,
} from "../controllers/user.controller";
import {
  signupValidator,
} from "@/src/middlewares/validation-middleware";
import { verifyJWT } from "@/src/middlewares/authn-middleware";
import { Routes, routeAuthzMap } from "@/lib/config";
import { AuthenticatedRequest } from "@/types";

const userRouter = Router();

// Get authenticated user
userRouter.get(
  '/me',
  verifyJWT, // authN
  (req: Request, res: Response, next: NextFunction) => {
    getMe(req as AuthenticatedRequest, res, next);
  }
);

// Get multiple users
userRouter.get(
  '/',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.user.getUsers), // authZ
  (req: Request, res: Response, next: NextFunction) => {
    getUsers(req as AuthenticatedRequest, res, next);
  }
);

// Get one user
userRouter.get(
  '/:id',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.user.getUserById), // authZ
  getUserById
);

// Create new user
userRouter.post(
  '/',
  signupValidator,
  // routeAuthzMap.get(Routes.user.createUser), // authZ
  createUser
);

// Update a user
userRouter.put(
  '/:id',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.user.editUserById), // authZ
  editUserById
);

// Delete a user
userRouter.delete(
  '/:id',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.user.deleteUserById), // authZ
  deleteUserById
);

export default userRouter;
