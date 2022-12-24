import { coordinates } from "./types";

export interface IUser {
    id?: string;
    name: string;
    email: string;
    password?: string;
    image?: string;
    places: string;
  }
  
  export interface IPlace {
    id?: string;
    creatorId: IUser['id'];
    title: string;
    description: string;
    address: string;
    coordinate: coordinates;
    imageUrl?: string;
  }