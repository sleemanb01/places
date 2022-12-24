import mongoose from "mongoose";
import { IPlace } from "../types/interfaces";

const Schema = mongoose.Schema;

const placeSchema = new Schema<IPlace>({
    creatorId:{type:String, required: true},
    title:{type:String, required: true},
    description:{type:String, required: true},
    address:{type:String, required: true},
    imageUrl:{type:String, required: false},
    coordinate:{ lat: {type: Number, required: true}, lng: {type: Number, required: true}},
});

export const PlaceModel = mongoose.model('Place', placeSchema);