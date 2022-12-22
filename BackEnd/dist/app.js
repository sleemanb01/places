"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const places_1 = require("./routes/places");
const users_1 = require("./routes/users");
const enums_1 = require("./types/enums");
const http_error_1 = require("./models/http-error");
const errorMessages_1 = require("./util/errorMessages");
/* ************************************************************** */
const app = (0, express_1.default)();
const port = 5000;
/* ************************************************************** */
app.use(body_parser_1.default.json());
app.use('/api/places', places_1.placesRoutes);
app.use('/api/users', users_1.usersRoutes);
app.use((_req, _res, _next) => {
    const error = new http_error_1.HttpError(errorMessages_1.ERROR_UNDEFINED_ROUTE, enums_1.HTTP_RESPONSE_STATUS.Bad_Request);
    throw error;
});
app.use((error, _req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
    res.json({ message: error.message || errorMessages_1.ERROR_DEFAULT_MESSAGE });
});
/* ************************************************************** */
app.listen(port);
