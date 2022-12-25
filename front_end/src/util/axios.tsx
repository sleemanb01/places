import axios from "axios";

import { HTTP_RESPONSE_STATUS } from "../typing/enums";
import { IUser } from "../typing/interfaces";

const URL = "http://localhost:5000/api/";

/* ************************************************************** */

export const signUp = async (user: IUser) => {
  const controller = URL + "users/signup";

  try {
    const res = await axios.post(controller, user);
    const resStatus = res.status;

    if (resStatus !== HTTP_RESPONSE_STATUS.Created) {
      throw new Error(res.data.message);
    }

    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
};

/* ************************************************************** */

export const login = async (user: IUser) => {
  const controller = URL + "users/login";

  try {
    const res = await axios.post(controller, user);
    const resStatus = res.status;

    if (resStatus !== HTTP_RESPONSE_STATUS.OK) {
      throw new Error(res.data.message);
    }

    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
};
