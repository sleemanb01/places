"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const placeSchema = new Schema({
    creatorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    imageUrl: { type: String, required: false },
    coordinate: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
});
exports.default = mongoose_1.default.model("Place", placeSchema);
