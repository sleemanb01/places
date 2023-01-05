"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoordsForAddress = void 0;
const axios_1 = __importDefault(require("axios"));
const http_error_1 = require("../models/http-error");
const enums_1 = require("../types/enums");
const messages_1 = require("./messages");
const API_KEY = "AIzaSyCSf_QGy1hKO-TV02oq9F4paGvsekJuaQI";
const getCoordsForAddress = async (address) => {
    const response = await axios_1.default.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
    const data = response.data;
    if (!data || data.status === "ZERO_RESULTS") {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_LOCATION, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity);
        throw error;
    }
    const coords = data.results[0].geometry.location;
    return coords;
};
exports.getCoordsForAddress = getCoordsForAddress;
