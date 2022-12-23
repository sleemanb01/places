import bodyParser from 'body-parser';
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpError } from './models/http-error';
import { placesRoutes } from './routes/places';
import { usersRoutes } from './routes/users';
import { HTTP_RESPONSE_STATUS } from './types/enums';
import { ERROR_UNDEFINED_ROUTE, ERROR_UNKNOWN_ERROR } from './util/errorMessages';
import mongoose from 'mongoose'

const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes);

app.use((_req, _res, _next) => {
  const error = new HttpError(ERROR_UNDEFINED_ROUTE, HTTP_RESPONSE_STATUS.Not_Found);
  throw error;
});

app.use((error:HttpError, _req:Request, res:Response, next:NextFunction) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || HTTP_RESPONSE_STATUS.Internal_Server_Error)
  res.json({message: error.message || ERROR_UNKNOWN_ERROR});
});

mongoose.connect('mongodb+srv://sleemanb:vutbcutbhqaz951@cluster0.vacgxjp.mongodb.net/places?retryWrites=true&w=majority')
.then(() => {
    app.listen(5000);
})
.catch((err) => {
    console.log(err);
})
