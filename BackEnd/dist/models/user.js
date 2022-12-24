"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const Schema = mongoose_1.default.Schema;
const MINLENGTH = 6;
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: MINLENGTH },
    imageUrl: { type: String, required: true },
    places: [{ type: mongoose_1.default.Types.ObjectId, required: true, ref: "Place" }],
});
userSchema.plugin(mongoose_unique_validator_1.default);
exports.UserModel = mongoose_1.default.model("User", userSchema);
