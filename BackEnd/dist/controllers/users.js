"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.login = exports.getUsers = void 0;
const uuid_1 = require("uuid");
const express_validator_1 = require("express-validator");
const http_error_1 = require("../models/http-error");
const enums_1 = require("../types/enums");
const errorMessages_1 = require("../util/errorMessages");
/* ************************************************************** */
const u1 = {
    id: "1",
    name: "sleeman",
    email: "sleeman.nabwani@gmail.com",
    password: "100200300",
    placesCount: 2,
};
const u2 = {
    id: "2",
    name: "ronen",
    email: "ronen.nabwani@gmail.com",
    password: "100200300",
    placesCount: 4,
};
let DUMMY = [u1, u2];
/* ************************************************************** */
const getUsers = (req, res, next) => {
    if (DUMMY.length === 0) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_ID, enums_1.HTTP_RESPONSE_STATUS.Not_Found));
    }
    res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json({ users: DUMMY });
};
exports.getUsers = getUsers;
const login = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const { email, password } = req.body;
    const targetUser = DUMMY.find(e => e.email === email);
    if (targetUser && targetUser.password === password) {
        res.status(enums_1.HTTP_RESPONSE_STATUS.OK).json();
    }
    return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_ID, enums_1.HTTP_RESPONSE_STATUS.Unauthorized));
};
exports.login = login;
const signup = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_INVALID_INPUTS, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    const newUser = req.body;
    const alreadySigned = DUMMY.find(u => u.email === newUser.email);
    if (alreadySigned) {
        return next(new http_error_1.HttpError(errorMessages_1.ERROR_EMAIL_EXIST, enums_1.HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    newUser.id = (0, uuid_1.v4)();
    newUser.placesCount = 0;
    DUMMY.push(newUser);
    res.status(enums_1.HTTP_RESPONSE_STATUS.Created).json({ user: newUser });
};
exports.signup = signup;
