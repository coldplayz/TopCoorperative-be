/**
* Formats use-case input and output.
* - ensures input data is in the form the
*   application-specific business rules/logic want it.
* - will pass dependencies to be injected to use cases,
*   thus knowing about and depending on their import.
*/

import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import * as userService from "@/src/services/user.service";
import eventEmitter from "../events/api-events";
import {
  AuthenticatedRequest,
  UserCreateDTO,
  UserQueryDTO,
  UserUpdateDTO,
} from "@/types";
import { ApiError } from "@/lib/error-handling";
import { getUserDataFrom, getUserQueryFrom, getUserUpdateFrom } from "@/lib/utils";
import { Types } from "mongoose";

const log = console.log; // SCAFF

// TODO:
// - see about decoupling controller from data service; perhaps
//   moving dependency injection to the main entry point - index.ts
// - data validation
// - data formatting

export async function getUsers(
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

  const queryObj: UserQueryDTO = getUserQueryFrom(req.query);

  try {
    const users = await userService.getUsers(
      queryObj,
      req.user
    );
    res.json({
      success: true,
      data: users,
    });
    eventEmitter.emit('getUsers', { getUsers: true, users });
  } catch (err: any) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const user = await userService.getUserById(id);

    if (!user) return next(new ApiError('User not found. Check ID', 404));

    res.json({
      success: true,
      data: user,
    });
    eventEmitter.emit('getUserById', { getUserById: true, user });
  } catch (err: any) {
    next(err);
  }
}

/**
 * Returns data for the signed-in user.
 */
export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  res.json({
    success: true,
    data: req.user,
  });
};

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  // console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: errors.array()[0]?.msg
    });
  }

  const userData: UserCreateDTO = getUserDataFrom(req.body);

  try {
    const newUser = await userService.createUser(userData);
    res.status(201).json({
      success: true,
      data: newUser,
    });
    eventEmitter.emit('createUser', { createUser: true, newUser });
  } catch (err: any) {
    next(err);
  }
}

export async function editUserById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const updateData: UserUpdateDTO = getUserUpdateFrom(req.body);

  try {
    const editedUser = await userService.editUserById(id, updateData);
    res.json({
      success: true,
      data: editedUser,
    });
    eventEmitter.emit('editUserById', { editUserById: true, editedUser });
  } catch (err: any) {
    next(err);
  }
}

export async function deleteUserById(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;

  try {
    const result = await userService.deleteUserById(id);
    res.status(204).json({ success: true, result });
    eventEmitter.emit('deleteUserById', { data: {} });
  } catch (err: any) {
    next(err);
  }
}
