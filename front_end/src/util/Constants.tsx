export const MINLENGTH = 6;
export const MAXLENGTH = 20;
export const MIN = 1;
export const MAX = 100;

/* ************************************************************** */

export const ERROR_TEXT_REQUIRED = "Please enter a valid text!";
export const ERROR_VALID_EMAIL = "Please enter a valid email!";
export const ERROR_DESCRIPTION_LENGTH = `Please enter a description between ${MINLENGTH}-${MAXLENGTH} characters!`;
export const ERROR_UNKNOWN = "Unknown error!";
export const ERROR_IMAGE = "Please provide an image!";

/* ************************************************************** */

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const BACKEND_API_URL = BACKEND_URL + "api/";
export const DEFAULT_HEADERS = { "Content-Type": "application/json" };

/* ************************************************************** */

export const ENDPOINT_SIGNUP = "users/signup";
export const ENDPOINT_LOGIN = "users/login";
export const ENDPOINT_GETUSERS = "users";
export const ENDPOINT_PLACES = "places";
export const ENDPOINT_USER_PLACES = "places/user";
