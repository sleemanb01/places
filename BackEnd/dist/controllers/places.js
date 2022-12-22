"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlace = exports.updatePlace = exports.createPlace = exports.getPlacesByUserId = exports.getPlaceById = void 0;
const uuid_1 = require("uuid");
const http_error_1 = require("../models/http-error");
const enums_1 = require("../types/enums");
const errorMessages_1 = require("../util/errorMessages");
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
const getPlaceById = (req, res, next) => {
    const placeId = req.params.placeId;
    const place = DUMMY.find(p => p.id === placeId);
    if (!place) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALIV_ID, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ place });
};
exports.getPlaceById = getPlaceById;
const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.userId;
    const places = DUMMY.filter(p => p.creatorId === userId);
    if (places.length === 0) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALIV_ID, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ places });
};
exports.getPlacesByUserId = getPlacesByUserId;
const createPlace = (req, res, next) => {
    const { title, description, coordinate, address, creatorId } = req.body;
    const newPlace = {
        id: (0, uuid_1.v4)(),
        title,
        description,
        coordinate,
        address,
        creatorId,
    };
    DUMMY.push(newPlace);
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json({ place: newPlace });
};
exports.createPlace = createPlace;
const updatePlace = (req, res, next) => {
    const { title, description } = req.body;
    const placeId = req.params.placeId;
    const updatedPlace = { ...DUMMY.find(p => p.id === placeId) };
    if (updatedPlace === undefined) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALIV_ID, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    const index = DUMMY.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY[index] = updatedPlace;
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ place: updatedPlace });
};
exports.updatePlace = updatePlace;
const deletePlace = (req, res, next) => {
    const placeId = req.params.placeId;
    DUMMY = DUMMY.filter(p => p.id !== placeId);
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json();
};
exports.deletePlace = deletePlace;
