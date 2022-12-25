export enum EValidatorType {
  REQUIRE,
  MINLENGTH,
  MAXLENGTH,
  MIN,
  MAX,
  EMAIL,
  FILE,
}

export enum EReducerActionType {
  CHNAGE,
  TOUCH,
  SET,
}

export enum HTTP_RESPONSE_STATUS {
  OK = 200,
  Created = 201,
  Accepted = 202,
  No_Content = 204,
  Bad_Request = 400,
  Unauthorized = 401,
  Not_Found = 404,
  Internal_Server_Error = 500,
  Unprocessable_Entity = 422,
}
