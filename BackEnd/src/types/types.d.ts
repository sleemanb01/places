export type coordinates = {
  lat: number;
  lng: number;
};

export type responseWToken = {
  userId: string;
  email: string;
  token: string;
};

export type AuthorizationRequest = Request & {
  headers: { authorization: string };
  userData: { userId: string };
};

// export interface IAuthorizedRequest extends Express.Request {
//   headers: { authorization: string };
//   userData: { userId: string };
// }
