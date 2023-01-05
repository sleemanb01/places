import { coordinate } from "./types";

export interface IUser {
  _id?: string;
  name?: string;
  email: string;
  password?: string;
  image?: string;
  places?: IPlace[];
}

export interface IPlace {
  _id?: string;
  creatorId: string;
  title: string;
  description: string;
  address: string;
  coordinate?: coordinate;
  image?: string;
}
