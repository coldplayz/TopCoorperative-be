import { Router } from "express";

import {
  getUsers,
  getUserById,
  createUser,
  editUserById,
  deleteUserById,
} from "../controllers/user.controller";
import {
  verifyJWT,
  signupValidator,
} from "../middlewares/middleware";
import { Routes, routeAuthzMap } from "@/lib/config";

const userRouter = Router();

// Get multiple users
// userRouter.get('/', (req, res) => res.json({ route: 'GET /users' }));
userRouter.get(
  '/',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.user.getUsers), // authZ
  getUsers
);

// Get one user
// userRouter.get('/:id', (req, res) => res.json({ route: 'GET /users/:id' }));
userRouter.get(
  '/:id',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.user.getUserById), // authZ
  getUserById
);

// Create new user
// userRouter.post('/', (req, res) => res.json({ route: 'POST /users' }));
userRouter.post(
  '/',
  signupValidator,
  // routeAuthzMap.get(Routes.user.createUser), // authZ
  createUser
);

// Update a user
// userRouter.put('/:id', (req, res) => res.json({ route: 'PUT /users/:id' }));
userRouter.put(
  '/:id',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.user.editUserById), // authZ
  editUserById
);

// Delete a user
// userRouter.delete('/:id', (req, res) => res.json({ route: 'DELETE /users/:id' }));
userRouter.delete(
  '/:id',
  verifyJWT, // authN
  routeAuthzMap.get(Routes.user.deleteUserById), // authZ
  deleteUserById
);

export default userRouter;
