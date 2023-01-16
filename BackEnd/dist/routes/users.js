"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const users_1 = require("../controllers/users");
const file_upload_1 = require("../middleware/file-upload");
/* ************************************************************** */
exports.usersRoutes = express_1.default.Router();
exports.usersRoutes.get("/", users_1.getUsers);
exports.usersRoutes.post("/signup", file_upload_1.fileUpload.single("image"), [
    (0, express_validator_1.check)("name").not().isEmpty(),
    (0, express_validator_1.check)("email").normalizeEmail().isEmail(),
    (0, express_validator_1.check)("password").isLength({ min: 8 }),
], users_1.signup);
exports.usersRoutes.post("/login", [
    (0, express_validator_1.check)("email").normalizeEmail().isEmail(),
    (0, express_validator_1.check)("password").isLength({ min: 8 }),
], users_1.login);
