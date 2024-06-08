/**
* Authentication services
*/

import jwt from "jsonwebtoken";

import User from "../models/user.model";
import { TEST_SECRET } from "@/lib/config";
import { ApiError } from "@/lib/error-handling";
import { DecodedRefreshToken, UserMethods, UserObj } from "@/types";
import { JwtPayload } from "jsonwebtoken";

export const loginUser = async (email: string, password: string) => {
  // Validate email and password presence
  if (!email || !password) {
    const error = new ApiError('Email and password are required', 400);
    throw error;
  }

  // Find the user by email in the database
  const user: UserObj = await User.findOne({ email });

  // Check if the user exists
  if (!user) {
    const error = new ApiError('Invalid email', 401);
    throw error;
  }

  // Verify the correctness of the provided password
  const isPasswordValid = await user.isPasswordCorrect(password);

  // Handle incorrect password
  if (!isPasswordValid) {
    const error = new ApiError('Incorrect password', 401);
    throw error;
  }

  // Generate access and refresh tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token in persisted user state
  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};

export const logoutUser = async (userId: string) => {
  // Remove the refresh token from the user's information
  // console.log(userId); // SCAFF
  const user = await User.findById(userId);

  if (!user) {
    const error = new ApiError('User not found', 404);
    throw error;
  }

  user.refreshToken = '';
  const result = await user.save();
  // console.log(result); // SCAFF

  return result;

  /*
  return User.findByIdAndUpdate(
    userId,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );
 */
};

export const refreshAccessToken = async (incomingRefreshToken: string) => {
  // Verify the incoming refresh token using the secret key
  const decodedToken: (JwtPayload | string) & { id?: string } = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET || TEST_SECRET
  );

  // Find the user associated with the refresh token
  const user: UserObj = await User.findById(decodedToken?.id);

  // If the user isn't found, deny access with a 404 Not Found status
  if (!user) {
    const error = new ApiError('User not found', 404);
    throw error;
  }

  // If the stored refresh token doesn't match the
  // incoming one, deny access with a 401 Unauthorized status
  if (user?.refreshToken !== incomingRefreshToken) {
    const error = new ApiError('Invalid refresh token', 401);
    throw error;
  }

  // Generate access and refresh tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token in persisted user state
  user.refreshToken = refreshToken;
  await user.save();

  // console.log('AR_TOKEN', accessToken, refreshToken); // SCAFF

  // return new access and refresh tokens
  return { accessToken, refreshToken };
};
