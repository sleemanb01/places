import axios, { AxiosError, AxiosResponse } from "axios";

import { HTTP_RESPONSE_STATUS } from "../typing/enums";
import { IUser } from "../typing/interfaces";
import { ERROR_UNKNOWN } from "./Constants";

const URL = "http://localhost:5000/api/";

const errorHandler = (error: Error | AxiosError | any): string => {
  if (error instanceof AxiosError) {
    return error.response?.data.message;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return ERROR_UNKNOWN;
  }
};

const throwError = (res: AxiosResponse) => {
  throw new Error(res.data.message);
};

/* ************************* POST ************************************* */

export const signUp = async (user: IUser) => {
  const controller = URL + "users/signup";

  try {
    const res = await axios.post(controller, user);
    const resStatus = res.status;

    if (resStatus !== HTTP_RESPONSE_STATUS.Created) {
      throwError(res);
    }

    return null;
  } catch (error: Error | AxiosError | any) {
    errorHandler(error);
  }
};

/* ************************************************************** */

export const login = async (user: IUser) => {
  const controller = URL + "users/login";

  try {
    const res = await axios.post(controller, user);
    const resStatus = res.status;

    if (resStatus !== HTTP_RESPONSE_STATUS.OK) {
      throwError(res);
    }

    return null;
  } catch (error: Error | AxiosError | any) {
    errorHandler(error);
  }
};

/* ******************************  GET ******************************** */

export const getUsers = async (): Promise<IUser[] | string | undefined> => {
  const controller = URL + "users";

  try {
    const res = await axios.get(controller);
    const resData = res.data;
    if (res.status !== HTTP_RESPONSE_STATUS.OK) {
      throwError(res);
    }
    const data = resData.users;
    return data as IUser[];
  } catch (error: Error | AxiosError | any) {
    errorHandler(error);
  }
};
