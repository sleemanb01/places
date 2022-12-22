import { coordinates } from "./types";

export interface user {
    id?: string;
    name: string;
    email: string;
    password?: string;
    image?: string;
    placesCount: number;
  }
  
  export interface place {
    id?: string;
    creatorId: user['id'];
    title: string;
    description: string;
    address: string;
    coordinate: coordinates;
    imageUrl?: string;
  }