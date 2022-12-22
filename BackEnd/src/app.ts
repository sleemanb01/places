import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';

import {placesRoutes} from './routes/places'; 
import {usersRoutes} from './routes/users';
import { HTTP_RESPONSE_STATUS } from './types/enums';
import { HttpError } from './models/http-error';
import { ERROR_UNDEFINED_ROUTE, ERROR_DEFAULT_MESSAGE } from './util/errorMessages';

/* ************************************************************** */

const app = express();
const port = 5000;


/* ************************************************************** */

app.use(bodyParser.json());

app.use('/api/places',placesRoutes);
app.use('/api/users',usersRoutes);

app.use((_req, _res, _next) => {
    const error = new HttpError(ERROR_UNDEFINED_ROUTE, HTTP_RESPONSE_STATUS.Bad_Request);
    throw error;
});

app.use((error:HttpError, _req:Request, res:Response, next:NextFunction) => {
    if(res.headersSent) {
        return next(error);
    }
    res.status(error.code || HTTP_RESPONSE_STATUS.Internal_Server_Error);
    res.json({message: error.message || ERROR_DEFAULT_MESSAGE});
});

/* ************************************************************** */

app.listen(port);
