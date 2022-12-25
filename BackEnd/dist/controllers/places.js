"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.createPlace = exports.getPlacesByUserId = exports.getPlaceById = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const place_model_1 = __importDefault(require("../models/place.model"));
const http_error_1 = require("../models/http-error");
const enums_1 = require("../types/enums");
const errorMessages_1 = require("../util/errorMessages");
const location_1 = require("../util/location");
/* ************************************************************** */
const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
    let place;
    try {
        place = await place_model_1.default.findById(placeId).exec();
    }
    catch (_a) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!place) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
        return next(error);
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ place: place.toObject({ getters: true }) });
};
exports.getPlaceById = getPlaceById;
/* ************************************************************** */
const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    let places = [];
    try {
        places = await place_model_1.default.find({ creatorId: userId }).exec();
    }
    catch (_a) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (places.length === 0) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
        return next(error);
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ places: places.map((place) => place.toObject({ getters: true })) });
};
exports.getPlacesByUserId = getPlacesByUserId;
/* ************************************************************** */
const createPlace = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { title, description, address, creatorId, imageUrl } = req.body;
    let coordinate;
    try {
        coordinate = await (0, location_1.getCoordsForAddress)(address);
    }
    catch (error) {
        return next(error);
    }
    let targetUser;
    try {
        targetUser = await place_model_1.default.findById(creatorId);
    }
    catch (_a) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_LOGIN, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (!targetUser) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    const newPlace = new place_model_1.default({
        creatorId,
        title,
        description,
        address,
        imageUrl,
        coordinate,
    });
    try {
        const sess = await mongoose_1.default.startSession();
        sess.startTransaction();
        await newPlace.save({ session: sess });
        targetUser.places.push(newPlace);
        await targetUser.save({ session: sess });
        sess.commitTransaction();
    }
    catch (_b) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json({ place: newPlace });
};
exports.createPlace = createPlace;
/* ************************************************************** */
const updatePlace = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { title, description } = req.body;
    const placeId = req.params.placeId;
    let place;
    try {
        place = await place_model_1.default.findById(placeId);
    }
    catch (_a) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!place) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    place.title = title;
    place.description = description;
    try {
        await place.save();
    }
    catch (_b) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ place: place.toObject({ getters: true }) });
};
exports.updatePlace = updatePlace;
/* ************************************************************** */
const deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;
    let targetPlace;
    try {
        targetPlace = await place_model_1.default.findById(placeId).populate("creatorId");
    }
    catch (_a) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!targetPlace) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
        return next(error);
    }
    try {
        const sess = await mongoose_1.default.startSession();
        sess.startTransaction();
        await targetPlace.remove({ session: sess });
        targetPlace.creatorId.places.pull(targetPlace);
        sess.commitTransaction();
    }
    catch (_b) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK);
};
exports.deletePlace = deletePlace;
