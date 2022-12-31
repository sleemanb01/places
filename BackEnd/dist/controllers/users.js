"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = exports.getUsers = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/user.model"));
const http_error_1 = require("../models/http-error");
const enums_1 = require("../types/enums");
const messages_1 = require("../util/messages");
/* ************************************************************** */
const getUsers = async (_req, res, next) => {
    let users;
    try {
        users = await user_model_1.default.find({}, "-password");
    }
    catch (_a) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res
        .status(enums_1.HTTP_RESPONSE_STATUS.OK)
        .json({ users: users.map((user) => user.toObject({ getters: true })) });
};
exports.getUsers = getUsers;
/* ************************************************************** */
const login = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(errors);
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
    if (!targetUser || targetUser.password !== password) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INVALID_CREDENTIALS, enums_1.HTTP_RESPONSE_STATUS.Unauthorized);
        return next(error);
    }
    res.json(targetUser.toObject({ getters: true }));
};
exports.login = login;
/* ************************************************************** */
const signup = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(messages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { name, email, password, imageUrl } = req.body;
    let alreadySigned;
    try {
        alreadySigned = await user_model_1.default.findOne({ email: email });
    }
    catch (_a) {
        return next(new http_error_1.HttpError(messages_1.ERROR_SIGNUP, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error));
    }
    if (alreadySigned) {
        return next(new http_error_1.HttpError(messages_1.ERROR_EMAIL_EXIST, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    let createdUser = new user_model_1.default({
        name,
        email,
        password,
        imageUrl,
        places: [],
    });
    try {
        await createdUser.save();
    }
    catch (_b) {
        const error = new http_error_1.HttpError(messages_1.ERROR_INTERNAL_SERVER, enums_1.HTTP_RESPONSE_STATUS.Internal_Server_Error);
        return next(error);
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json(createdUser);
};
exports.signup = signup;
