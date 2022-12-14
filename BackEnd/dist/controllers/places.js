"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.createPlace = exports.getPlacesByUserId = exports.getPlaceById = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const place_model_1 = __importDefault(require("../models/place.model"));
const http_error_1 = require("../models/http-error");
const enums_1 = require("../types/enums");
const messages_1 = require("../util/messages");
const location_1 = require("../util/location");
/* ************************************************************** */
const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
    let place;
    try {
        place = await place_model_1.default.findById(placeId).exec();
    }
    catch (_a) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!place) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
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
    let userWPlaces;
    try {
        userWPlaces = await user_model_1.default.findById(userId).populate("places");
    }
    catch (_a) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!userWPlaces) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
        return next(error);
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({
        places: userWPlaces.places.map((place) => place.toObject({ getters: true })),
    });
};
exports.getPlacesByUserId = getPlacesByUserId;
/* ************************************************************** */
const createPlace = async (req, res, next) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { title, description, address } = req.body;
    const creatorId = req.userData.userId;
    let coordinate;
    try {
        coordinate = await (0, location_1.getCoordsForAddress)(address);
    }
    catch (error) {
        return next(error);
    }
    let targetUser;
    try {
        targetUser = await user_model_1.default.findById(creatorId);
    }
    catch (_b) {
        return next(new http_error_1.HttpError(messages_1.ERROR_LOGIN, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (!targetUser) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    const newPlace = new place_model_1.default({
        creatorId,
        title,
        description,
        address,
        image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
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
    catch (_c) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json({ place: newPlace });
};
exports.createPlace = createPlace;
/* ************************************************************** */
const updatePlace = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { title, description } = req.body;
    const placeId = req.params.placeId;
    let place;
    try {
        place = await place_model_1.default.findById(placeId);
    }
    catch (_a) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if ((place === null || place === void 0 ? void 0 : place.creatorId.toString()) !== req.userData.userId) {
        const error = new http_error_1.HttpError(messages_1.ERROR_UNAUTHORIZED, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    if (!place) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    place.title = title;
    place.description = description;
    try {
        await place.save();
    }
    catch (_b) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
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
        const error = new http_error_1.HttpError(messages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!targetPlace) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
        return next(error);
    }
    if (targetPlace.creatorId._id &&
        (targetPlace === null || targetPlace === void 0 ? void 0 : targetPlace.creatorId.id) !== req.userData.userId) {
        const error = new http_error_1.HttpError(messages_1.ERROR_UNAUTHORIZED, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    try {
        const sess = await mongoose_1.default.startSession();
        sess.startTransaction();
        await targetPlace.remove({ session: sess });
        targetPlace.creatorId.places.pull(targetPlace);
        await targetPlace.creatorId.save({ session: sess });
        await sess.commitTransaction();
    }
    catch (_b) {
        const error = new http_error_1.HttpError(messages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    fs_1.default.unlink(targetPlace.image, (err) => {
        console.log(err.message);
    });
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ message: messages_1.DELETED });
};
exports.deletePlace = deletePlace;
