import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import mongoose, { HydratedDocument, Model, Query, Schema } from "mongoose";

import { IUser } from "../models/user.model";
import Place from "../models/place.model";
import { HttpError } from "../models/http-error";
import { HTTP_RESPONSE_STATUS } from "../types/enums";
import {
  ERROR_DELETE,
  ERROR_INTERNAL_SERVER,
  ERROR_INVALID_DATA,
  ERROR_INVALID_INPUTS,
  ERROR_LOGIN,
} from "../util/errorMessages";
import { getCoordsForAddress } from "../util/location";

/* ************************************************************** */

export const getPlaceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findById(placeId).exec();
  } catch {
    const error = new HttpError(
      ERROR_INVALID_DATA,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      ERROR_INVALID_DATA,
      HTTP_RESPONSE_STATUS.Not_Found
    );
    return next(error);
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ place: place.toObject({ getters: true }) });
};

/* ************************************************************** */

export const getPlacesByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;
  let places = [];

  try {
    places = await Place.find({ creatorId: userId }).exec();
  } catch {
    const error = new HttpError(
      ERROR_INVALID_DATA,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  if (places.length === 0) {
    const error = new HttpError(
      ERROR_INVALID_DATA,
      HTTP_RESPONSE_STATUS.Not_Found
    );
    return next(error);
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ places: places.map((place) => place.toObject({ getters: true })) });
};

/* ************************************************************** */

export const createPlace = async (
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

  const { title, description, address, creatorId, imageUrl } = req.body;
  let coordinate;

  try {
    coordinate = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  let targetUser: IUser | null;

  try {
    targetUser = await Place.findById(creatorId);
  } catch {
    return next(
      new HttpError(ERROR_LOGIN, HTTP_RESPONSE_STATUS.Internal_Server_Error)
    );
  }

  if (!targetUser) {
    const error = new HttpError(
      ERROR_INVALID_DATA,
      HTTP_RESPONSE_STATUS.Unauthorized
    );
    return next(error);
  }

  const newPlace = new Place({
    creatorId,
    title,
    description,
    address,
    imageUrl,
    coordinate,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await newPlace.save({ session: sess });
    targetUser.places.push(newPlace);
    await targetUser!.save({ session: sess });
    sess.commitTransaction();
  } catch {
    const error = new HttpError(
      ERROR_INTERNAL_SERVER,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  res.status(HTTP_RESPONSE_STATUS.Created).json({ place: newPlace });
};

/* ************************************************************** */

export const updatePlace = async (
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

  const { title, description } = req.body;
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch {
    const error = new HttpError(
      ERROR_INTERNAL_SERVER,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found)
    );
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch {
    const error = new HttpError(
      ERROR_INTERNAL_SERVER,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  res
    .status(HTTP_RESPONSE_STATUS.OK)
    .json({ place: place.toObject({ getters: true }) });
};

/* ************************************************************** */

export const deletePlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const placeId = req.params.placeId;
  let targetPlace;

  try {
    targetPlace = await Place.findById(placeId).populate<{ creatorId: IUser }>(
      "creatorId"
    );
  } catch {
    const error = new HttpError(
      ERROR_DELETE,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  if (!targetPlace) {
    const error = new HttpError(
      ERROR_INVALID_DATA,
      HTTP_RESPONSE_STATUS.Not_Found
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await targetPlace!.remove({ session: sess });
    targetPlace.creatorId.places.pull(targetPlace);
    sess.commitTransaction();
  } catch {
    const error = new HttpError(
      ERROR_DELETE,
      HTTP_RESPONSE_STATUS.Internal_Server_Error
    );
    return next(error);
  }

  res.status(HTTP_RESPONSE_STATUS.OK);
};
