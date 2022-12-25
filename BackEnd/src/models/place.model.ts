import mongoose, { Types, Document } from "mongoose";
import { coordinates } from "../types/types";
import { IUser } from "./user.model";

const Schema = mongoose.Schema;

export interface IPlace extends Document {
  id?: Types.ObjectId;
  creatorId: IUser["id"];
  title: string;
  description: string;
  address: string;
  coordinate: coordinates;
  imageUrl?: string;
}

const placeSchema = new Schema<IPlace>({
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

export default mongoose.model<IPlace>("Place", placeSchema);
