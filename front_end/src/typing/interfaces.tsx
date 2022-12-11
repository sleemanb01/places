import { coordinate } from "./types";

export interface user {
  id?: number;
  name: string;
  email: string;
  password?: string;
  image?: string;
  placesCount: number;
}

export interface place {
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
  user: user | undefined;
  login: (user: user) => void;
  updatePerson: (user: user) => void;
  logout: () => void;
}
