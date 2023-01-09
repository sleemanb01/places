"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const http_error_1 = require("../models/http-error");
const enums_1 = require("../types/enums");
const messages_1 = require("../util/messages");
/* ************************************************************** */
const SECRET_KEY = "topSecret";
const internalError = () => {
    return new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
};
/* ************************************************************** */
const getUsers = async (_req, res, next) => {
    let users;
    try {
        users = await user_model_1.default.find({}, "-password");
    }
    catch (_a) {
        return next(internalError());
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ users: users.map((user) => user.toObject({ getters: true })) });
};
exports.getUsers = getUsers;
/* ************************************************************** */
const login = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { email, password } = req.body;
    let targetUser;
    try {
        targetUser = await user_model_1.default.findOne({ email: email });
    }
    catch (_a) {
        return next(new http_error_1.HttpError(messages_1.ERROR_LOGIN, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (!targetUser) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_CREDENTIALS, enums_1.HTTP_RESPONSE_STATUS.Forbidden);
        return next(error);
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcryptjs_1.default.compare(password, targetUser.password);
    }
    catch (_b) {
        return next(internalError());
    }
    if (!isValidPassword) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_CREDENTIALS, enums_1.HTTP_RESPONSE_STATUS.Forbidden);
        return next(error);
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId: targetUser.id, email: targetUser.email }, SECRET_KEY, { expiresIn: "1h" });
    }
    catch (_c) {
        return next(internalError());
    }
    const ret = {
        id: targetUser.id,
        email: targetUser.email,
        token,
    };
    res.json(ret);
};
exports.login = login;
/* ************************************************************** */
const signup = async (req, res, next) => {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { name, email, password } = req.body;
    const salt = 12;
    let alreadySigned;
    try {
        alreadySigned = await user_model_1.default.findOne({ email: email });
    }
    catch (_b) {
        return next(new http_error_1.HttpError(messages_1.ERROR_SIGNUP, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (alreadySigned) {
        return next(new http_error_1.HttpError(messages_1.ERROR_EMAIL_EXIST, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    let hashedPassword;
    try {
        hashedPassword = await bcryptjs_1.default.hash(password, salt);
    }
    catch (_c) {
        return next(internalError());
    }
    let createdUser = new user_model_1.default({
        name,
        email,
        password: hashedPassword,
        image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path,
        places: [],
    });
    try {
        await createdUser.save();
    }
    catch (_d) {
        return next(internalError());
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ userId: createdUser.id, email: createdUser.email }, SECRET_KEY, { expiresIn: "1h" });
    }
    catch (_e) {
        return next(internalError());
    }
    const ret = {
        id: createdUser.id,
        email: createdUser.email,
        token,
    };
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json(ret);
};
exports.signup = signup;
