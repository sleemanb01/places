import { coordinate } from "./types";

export interface IUser {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  image?: string;
  placesCount?: number;
}

export interface IPlace {
  id: number;
  creatorId: number;
  title: string;
  description: string;
  address: string;
  coordinate: coordinate;
  imageUrl: string;
}

export interface ICtx {
  isLoggedIn: boolean;
  user: IUser | undefined;
  login: (user: IUser) => void;
  updatePerson: (user: IUser) => void;
  logout: () => void;
}
