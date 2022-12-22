"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const enums_1 = require("../types/enums");
/* ************************************************************** */
exports.usersRoutes = express_1.default.Router();
exports.usersRoutes.get('/:placeId', (req, res) => {
    console.log('get REQ in Places');
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ text: 'it Work!' });
});
