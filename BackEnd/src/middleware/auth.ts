import jwt from "jsonwebtoken";
import express, { Response, NextFunction } from "express";

import { HttpError } from "../models/http-error";
import { HTTP_RESPONSE_STATUS } from "../types/enums";
import { AuthorizationRequest } from "../types/types";
import { ERROR_UNAUTHORIZED } from "../util/messages";

interface UserIDJwtPayload extends jwt.JwtPayload {
  userId: string;
}

export const authenticate = (
  req: AuthorizationRequest,
  _res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'

    if (!token) {
      throw new Error();
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY as string);
    const userId = (decodedToken as UserIDJwtPayload).userId;
    req.userData = { userId: userId };
    next();
  } catch {
    const error = new HttpError(
      ERROR_UNAUTHORIZED,
      HTTP_RESPONSE_STATUS.Forbidden
    );

    return next(error);
  }
};
