"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.createPlace = exports.getPlacesByUserId = exports.getPlaceById = void 0;
const express_validator_1 = require("express-validator");
const http_error_1 = require("../models/http-error");
const place_1 = require("../models/place");
const enums_1 = require("../types/enums");
const errorMessages_1 = require("../util/errorMessages");
const location_1 = require("../util/location");
/* ************************************************************** */
const p1 = {
    id: "1",
    creatorId: "1",
    title: "Empire state building",
    description: "one of the most popular sky scrapers on the world",
    address: "20 W 34th st, New York, NY 10001",
    coordinate: {
        lat: 40.7484405,
        lng: -73.9878584,
    },
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
};
const p2 = {
    id: "2",
    creatorId: "1",
    title: "Azrieli Center",
    description: "one of the most popular building in israel",
    address: "Derech Menachem Begin, Tel Aviv-Yafo",
    coordinate: {
        lat: 32.0740769,
        lng: 34.7900141,
    },
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
};
let DUMMY = [p1, p2];
/* ************************************************************** */
const getPlaceById = async (req, res, next) => {
    const placeId = req.params.placeId;
    let place;
    try {
        place = await place_1.placeModel.findById(placeId).exec();
    }
    catch (_a) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (!place) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
        return next(error);
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ place: place.toObject({ getters: true }) });
};
exports.getPlaceById = getPlaceById;
/* ************************************************************** */
const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.userId;
    let places = [];
    try {
        places = await place_1.placeModel.find({ creatorId: userId }).exec();
    }
    catch (_a) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    if (places.length === 0) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_DATA, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
        return next(error);
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ places: places.map(place => place.toObject({ getters: true })) });
};
exports.getPlacesByUserId = getPlacesByUserId;
/* ************************************************************** */
const createPlace = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { title, description, address, creatorId } = req.body;
    let coordinate;
    try {
        coordinate = await (0, location_1.getCoordsForAddress)(address);
    }
    catch (error) {
        return next(error);
    }
    const newPlace = new place_1.placeModel({
        title,
        description,
        address,
        coordinate,
        creatorId,
    });
    try {
        await newPlace.save();
    }
    catch (_a) {
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
        place = await place_1.placeModel.findById(placeId);
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
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ place: place.toObject({ getters: true }) });
};
exports.updatePlace = updatePlace;
/* ************************************************************** */
const deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;
    let targetPlace;
    try {
        targetPlace = await place_1.placeModel.findById(placeId);
    }
    catch (_a) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    try {
        await (targetPlace === null || targetPlace === void 0 ? void 0 : targetPlace.remove());
    }
    catch (_b) {
        const error = new http_error_1.HttpError(errorMessages_1.ERROR_DELETE, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK);
};
exports.deletePlace = deletePlace;
