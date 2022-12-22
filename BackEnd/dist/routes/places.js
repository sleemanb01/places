"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const places_1 = require("../controllers/places");
const express_validator_1 = require("express-validator");
/* ************************************************************** */
exports.placesRoutes = express_1.default.Router();
exports.placesRoutes.get('/:placeId', places_1.getPlaceById);
exports.placesRoutes.get('/user/:userId', places_1.getPlacesByUserId);
exports.placesRoutes.post('/', [(0, express_validator_1.check)('title').not().isEmpty(), (0, express_validator_1.check)('description').isLength({ min: 5 }), (0, express_validator_1.check)('address').not().isEmpty()], places_1.createPlace);
exports.placesRoutes.patch('/:placeId', [(0, express_validator_1.check)('title').not().isEmpty(), (0, express_validator_1.check)('description').isLength({ min: 5 })], places_1.updatePlace);
exports.placesRoutes.delete('/:placeId', places_1.deletePlace);
