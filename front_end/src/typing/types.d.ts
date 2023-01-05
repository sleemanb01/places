import { EReducerActionType, EValidatorType } from "./enums";
import { IUser } from "./interfaces";

export type AuthCtx = {
  isLoggedIn: boolean;
  user: responseWToken | undefined;
  login: (user: responseWToken) => void;
  updatePerson: (user: responseWToken) => void;
  logout: () => void;
};

export type coordinate = {
  lat: number;
  lng: number;
};

export type reducerInputState = {
  value: string;
  isTouched?: boolean;
  isValid: boolean;
};

export type reducerFormState = {
  inputs: {
    [id: string]: reducerInputState | undefined;
  };
  isValid: boolean;
};

export type reducerInputAction = {
  val: string;
  type: EReducerActionType;
  validators: EValidatorType[];
};

export type reducerFormAction = {
  type: EReducerActionType;
  input: reducerInputState | reducerFormState;
  inputId?: string;
};

export type userWToken = {
  userId: string;
  email: string;
  token: string;
};
