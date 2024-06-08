/**
* Module for providing database services and logic for the User model.
* - must satisfy entity (core business rules) required interface
* - will be called by entity objects,
*   which will receive input data from controllers.
* - don't wrap in try/catch; let errors bubble up to controller.
*/

import { ApiError } from "@/lib/error-handling";
import { updateUser } from "@/lib/utils";
import User from "@/src/models/user.model";
import {
  UserCreateDTO,
  UserQueryDTO,
  UserUpdateDTO,
  UserDoc,
  UserObj,
} from "@/types";
// import { Document } from "mongoose";

export async function getUsers(queryObj: UserQueryDTO) {
  return User.find(queryObj);
}

export async function getUserById(id: string) {
  return User.findById(id);
}

export async function createUser(userData: UserCreateDTO) {
  const newUser = new User(userData);
  await newUser.save();

  return newUser;
}

export async function editUserById(id: string, updateObj: UserUpdateDTO) {
  const existingUser: UserObj = await User.findById(id);

  if (!existingUser) {
    const error = new ApiError('User not found', 404);
    throw error;
  }

  const updatedUser = updateUser(existingUser, updateObj);

  updatedUser.save();

  return updateUser;
}

export async function deleteUserById(id: string) {
  const existingUser = await User.findById(id);

  if (!existingUser) {
    const error = new ApiError('User not found', 404);
    throw error;
  }

  await User.deleteOne({ _id: id });

  return {};
}
