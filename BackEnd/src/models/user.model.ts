import mongoose, { Schema, Document, Types } from "mongoose";
import { IPlace } from "./place.model";

export interface IUser extends Document {
  id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  imageUrl?: string;
  places: mongoose.Types.Array<IPlace>;
}

const MINLENGTH = 6;

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: MINLENGTH },
  imageUrl: { type: String, required: true },
  places: [{ type: Schema.Types.ObjectId, required: true, ref: "Place" }],
});

export default mongoose.model<IUser>("User", UserSchema);
