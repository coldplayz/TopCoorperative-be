/**
* Model for mapping to database.
* - Framework-specific to Mongoosejs
* - Database-specific to MongoDB
*/

// TODO:
// - implement support for multiple refresh
//   tokens to enable sign in from multiple devices.

import { Schema, model, Types } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  TEST_SECRET,
  UserRoles,
} from "@/lib/config";

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  isLoanable: {
    type: Boolean,
    default: true,
  },
  role: {
    type: String,
    enum: [...Object.values(UserRoles)],
    default: UserRoles.USER,
  },
  /*
  tasks: [
    {
      type: Types.ObjectId,
      ref: 'Task',
    }
  ],
 */
  refreshToken: String,
}, {
  timestamps: true, // This adds createdAt and updatedAt fields
});

// Middleware to hash the password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
  next();
});

// Method to check if the entered password is correct
UserSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compareSync(password, this.password);
};

// Ensure sensitive idata is not returned
UserSchema.set("toJSON", {
  // virtuals: true,
  transform: function (doc, ret, options) {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

// Method to generate an access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET || TEST_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

// Method to generate a refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET || TEST_SECRET,
    {
      expiresIn: "2d",
    }
  );
};

// Compile the schema into a model
const User = model('User', UserSchema);

export default User;
