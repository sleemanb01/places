export type coordinates = {
  lat: number;
  lng: number;
};

export type responseWToken = {
  id: string;
  email: string;
  token: string;
};

export type AuthorizationRequest = Request<
  ParamsDictionary,
  any,
  any,
  ParsedQs,
  Record<string, any>
> & {
  headers: { authorization: string };
  userData: { userId: string };
  userData: responseWToken;
};

// export interface IAuthorizedRequest extends Express.Request {
//   headers: { authorization: string };
//   userData: { userId: string };
// }
