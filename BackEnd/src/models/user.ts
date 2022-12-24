import mongoose from "mongoose";
import { IUser } from "../types/interfaces";
import uniqueValidator from 'mongoose-unique-validator'


const Schema = mongoose.Schema;

const MINLENGTH = 6;

const userSchema = new Schema<IUser>({
    name : {type : String, required : true},
    email : {type : String, required : true, unique:true},
    password : {type : String, required : true, minlength:MINLENGTH},
    image : {type : String, required : true},
    places : {type : String, required : true}
});

userSchema.plugin(uniqueValidator);

export const UserModel = mongoose.model('User', userSchema);