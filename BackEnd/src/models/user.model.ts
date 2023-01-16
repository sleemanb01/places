import mongoose, { Schema, Document, Types } from "mongoose";
import { IPlace } from "./place.model";

export interface IUser extends Document {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  places: Types.Array<IPlace>;
}

const MINLENGTH = 6;

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: MINLENGTH },
  image: { type: String, required: false },
  places: [{ type: Schema.Types.ObjectId, required: true, ref: "Place" }],
});

export default mongoose.model<IUser>("User", UserSchema);
