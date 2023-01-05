"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const http_error_1 = require("./models/http-error");
const places_1 = require("./routes/places");
const users_1 = require("./routes/users");
const enums_1 = require("./types/enums");
const messages_1 = require("./util/messages");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const PORT = 5000;
const URI = "mongodb+srv://placesAdmin:vutbcutbhqaz951@cluster0.vacgxjp.mongodb.net/places?retryWrites=true&w=majority";
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use("/uploads/images", express_1.default.static(path_1.default.join("uploads", "images")));
app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});
app.use("/api/places", places_1.placesRoutes);
app.use("/api/users", users_1.usersRoutes);
app.use((_req, _res, _next) => {
    const error = new http_error_1.HttpError(messages_1.ERROR_UNDEFINED_ROUTE, enums_1.HTTP_RESPONSE_STATUS.Not_Found);
    throw error;
});
app.use((error, req, res, next) => {
    if (req.file) {
        fs_1.default.unlink(req.file.path, () => {
            console.log(error);
        });
    }
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
    res.json({ message: error.message || messages_1.ERROR_UNKNOWN_ERROR });
});
mongoose_1.default
    .connect(URI)
    .then(() => {
    app.listen(PORT);
})
    .catch((err) => {
    console.log(err);
});
