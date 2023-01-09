import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
} from "../util/messages";
import { responseWToken } from "../types/types";

/* ************************************************************** */

const SECRET_KEY = "topSecret";

const internalError = () => {
  return new HttpError(
    ERROR_INTERNAL_SERVER,
    HTTP_RESPONSE_STATUS.Internal_Server_Error
  );
};

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
    return next(internalError());
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

  if (!targetUser) {
    const error = new HttpError(
      ERROR_INVALID_CREDENTIALS,
      HTTP_RESPONSE_STATUS.Forbidden
    );

    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, targetUser.password!);
  } catch {
    return next(internalError());
  }

  if (!isValidPassword) {
    const error = new HttpError(
      ERROR_INVALID_CREDENTIALS,
      HTTP_RESPONSE_STATUS.Forbidden
    );

    return next(error);
  }

  let token;

  try {
    token = jwt.sign(
      { userId: targetUser.id, email: targetUser.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch {
    return next(internalError());
  }

  const ret: responseWToken = {
    id: targetUser.id,
    email: targetUser.email,
    token,
  };

  res.json(ret);
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

  const { name, email, password } = req.body;
  const salt = 12;

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, salt);
  } catch {
    return next(internalError());
  }

  let createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file?.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch {
    return next(internalError());
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
  } catch {
    return next(internalError());
  }

  const ret: responseWToken = {
    id: createdUser.id,
    email: createdUser.email,
    token,
  };

  res.status(HTTP_RESPONSE_STATUS.Created).json(ret);
};
