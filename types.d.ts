/**
* User and Task entity interfaces and types.
* - inputs/method args, and plugins must satisfy these interfaces.
*/

// TODO:
// - types are still coupled to the web framework;
//   see about achieving true decoupling.

import { HydratedDocument, Model, Types } from "mongoose";
import jwt from "jsonwebtoken";
import { Request } from "express";

type AuthenticatedRequest = Request & { user: DecodedAccessToken };

// ======= Users =======

type BaseUserDTO = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  refreshToken?: string;
  role?: string;
}
type RawBaseUserDTO = {
  [k in keyof BaseUserDTO]: string;
};

type UserCreateDTO = Required<Omit<BaseUserDTO, 'refreshToken' | 'role'>>;
type RawUserCreateDTO = {
  [k in keyof UserCreateDTO]: string;
};

type UserQueryDTO = BaseUserDTO & {
  createdAt?: Date;
  updatedAt?: Date;
};
export type RawUserQueryDTO = {
  [k in keyof UserQueryDTO]: string;
}

export type UserUpdateDTO = Omit<BaseUserDTO, 'refreshToken' | 'password'>;
export type RawUserUpdateDTO = {
  [k in keyof UserUpdateDTO]: string;
}

type DecodedAccessToken = {
  id: string;
  email: string;
  role: string;
};
type AccessToken = string;

type DecodedRefreshToken = {
  id: string;
};
type RefreshToken = string;

type UserMethods = {
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): AccessToken;
  generateRefreshToken(): RefreshToken;
};

// How you expect a User to be stored in the db
type User = Required<BaseUserDTO> & {
  createdAt: Date;
  updatedAt: Date;
  // __v: number;
};

type UserDoc = HydratedDocument<User>;

type UserObj = (UserDoc & UserMethods) | null;

// ====== Requests =======

type BaseRequestDTO = {
  amountRequested?: number;
  status?: string;
  tenure?: number;
  amountRepayable?: number;
  userId?: Types.ObjectId;
}
type RawBaseRequestDTO = {
  [k in keyof BaseRequestDTO]: string;
};

type RequestCreateDTO = Required<Omit<BaseRequestDTO, 'status'>>;
type RawRequestCreateDTO = { [k in keyof RequestCreateDTO]: string };

type RequestQueryDTO = BaseRequestDTO & {
  createdAt?: Date;
  updatedAt?: Date;
};
type RawRequestQueryDTO = { [k in keyof RequestQueryDTO]: string };

type RequestUpdateDTO = Omit<BaseRequestDTO, 'userId'>;
type RawRequestUpdateDTO = { [k in keyof RequestUpdateDTO]: string };

// How you expect a Request to be stored in the db
type LoanRequest = Required<BaseRequestDTO> & {
  createdAt: Date;
  updatedAt: Date;
  // __v: number;
};

// After calling `new Model(objDef)`
type RequestDoc = HydratedDocument<LoanRequest>;

// ====== Loans =======

// With actual data type...
type BaseLoanDTO = {
  hasPaid?: boolean;
  amountPaid?: number;
  dueDate?: Date;
  requestId?: Types.ObjectId;
}
// ...and as retrieved from HTTP request.
type RawBaseLoanDTO = {
  [k in keyof BaseLoanDTO]: string;
};

type LoanCreateDTO = Required<Omit<BaseLoanDTO, 'hasPaid' | 'amountPaid'>>;
type RawLoanCreateDTO = { [k in keyof LoanCreateDTO]: string };

type LoanQueryDTO = BaseLoanDTO & {
  createdAt?: Date;
  updatedAt?: Date;
};
type RawLoanQueryDTO = { [k in keyof LoanQueryDTO]: string };

type LoanUpdateDTO = Omit<BaseLoanDTO, 'requestId'>;
type RawLoanUpdateDTO = { [k in keyof LoanUpdateDTO]: string };

// How you expect a Request to be stored in the db
type Loan = Required<BaseLoanDTO> & {
  createdAt: Date;
  updatedAt: Date;
  // __v: number;
};

// After calling `new Model(objDef)`
type LoanDoc = HydratedDocument<Loan>;

/*
interface ITaskServicePlugin {
  getTasks(queryObj: ITaskQueryDTO): Promise<TaskDoc[]>;
  getTaskById(id: string): Promise<TaskDoc>;
  createTask(taskData: ITaskCreateDTO): Promise<TaskDoc>;
  editTaskById(id: string, updateObj: ITaskUpdateDTO): Promise<TaskDoc>;
  deleteTaskById(id: string): Promise<ReturnType<typeof Model.deleteOne>>;
};
*/

/*
export interface IUserServicePlugin {
  getUsers(queryObj: IUserQueryDTO): Promise<UserDoc[]>;
  getUserById(id: string): Promise<UserDoc>;
  createUser(userData: IUserCreateDTO): Promise<UserDoc>;
  editUserById(id: string, updateObj: IUserUpdateDTO): Promise<UserDoc>;
  deleteUserById(id: string): Promise<ReturnType<typeof Model.deleteOne>>;
};
*/
