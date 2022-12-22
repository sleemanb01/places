"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const places_1 = require("../controllers/places");
/* ************************************************************** */
exports.placesRoutes = express_1.default.Router();
exports.placesRoutes.get('/:placeId', places_1.getPlaceById);
exports.placesRoutes.get('/user/:userId', places_1.getPlacesByUserId);
exports.placesRoutes.post('/', places_1.createPlace);
exports.placesRoutes.patch('/:placeId', places_1.updatePlace);
exports.placesRoutes.delete('/:placeId', places_1.deletePlace);
