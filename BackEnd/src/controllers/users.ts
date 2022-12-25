import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import User from "../models/user.model";
import { HttpError } from "../models/http-error";
import { HTTP_RESPONSE_STATUS } from "../types/enums";
import {
  ERROR_EMAIL_EXIST,
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_CREDENTIALS,
  ERROR_INVALID_INPUTS,
  ERROR_LOGIN,
  ERROR_SIGNUP,
} from "../util/errorMessages";

/* ************************************************************** */

export const getUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch {
    const error = new HttpError(
      ERROR_INTERNAL_SERVER,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

/* ************************************************************** */

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        ERROR_INVALID_INPUTS,
        HTTP_RESPONSE_STATUS.Unprocessable_Entity
      )
    );
  }

  const { email, password } = req.body;

  let targetUser;

  try {
    targetUser = await User.findOne({ email: email });
  } catch {
    return next(
      new HttpError(ERROR_LOGIN, HTTP_RESPONSE_STATUS.Internal_Server_Error)
    );
  }

  if (!targetUser || targetUser.password !== password) {
    const error = new HttpError(
      ERROR_INVALID_CREDENTIALS,
      HTTP_RESPONSE_STATUS.Unauthorized
    );

    return next(error);
  }

  res.json({ message: "Logged in!" });
};

/* ************************************************************** */

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError(
        ERROR_INVALID_INPUTS,
        HTTP_RESPONSE_STATUS.Unprocessable_Entity
      )
    );
  }

  const { name, email, password, imageUrl } = req.body;

  let alreadySigned;

  try {
    alreadySigned = await User.findOne({ email: email });
  } catch {
    return next(
      new HttpError(ERROR_SIGNUP, HTTP_RESPONSE_STATUS.Internal_Server_Error)
    );
  }

  if (alreadySigned) {
    return next(
      new HttpError(
        ERROR_EMAIL_EXIST,
        HTTP_RESPONSE_STATUS.Unprocessable_Entity
      )
    );
  }

  let createdUser = new User({
    name,
    email,
    password,
    imageUrl,
    places: [],
  });

  try {
    await createdUser.save();
  } catch {
    const error = new HttpError(
      ERROR_INTERNAL_SERVER,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  res.status(HTTP_RESPONSE_STATUS.Created).json({ user: createdUser });
};
