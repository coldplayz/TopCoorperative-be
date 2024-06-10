import { Router, Request, Response, NextFunction } from "express";

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/auth.controller";
import {
  loginValidator,
} from "@/src/middlewares/validation-middleware";
import { verifyJWT } from "@/src/middlewares/authn-middleware";
import { AuthenticatedRequest } from "@/types";

const authRouter = Router();

// Login route
authRouter.post('/signin', loginValidator, loginUser);

// Logout
authRouter.post(
  '/signout',
  verifyJWT,
  (req: Request, res: Response, next: NextFunction) => {
    logoutUser(req as AuthenticatedRequest, res, next);
  }
);

// Refresh token
authRouter.post('/refresh-token', refreshAccessToken);

export default authRouter;
