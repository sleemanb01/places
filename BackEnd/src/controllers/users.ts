import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validationResult } from 'express-validator'

import { HttpError } from '../models/http-error';
import { HTTP_RESPONSE_STATUS } from '../types/enums';
import { IUser } from '../types/interfaces';
import { ERROR_EMAIL_EXIST, ERROR_INVALID_DATA, ERROR_INVALID_INPUTS } from '../util/errorMessages';

/* ************************************************************** */

const u1 = {
    id: "1",
    name: "sleeman",
    email: "sleeman.nabwani@gmail.com",
    password: "100200300",
    placesCount: 2,

  };

  const u2 = {
    id: "2",
    name: "ronen",
    email: "ronen.nabwani@gmail.com",
    password: "100200300",
    placesCount: 4,

  };

let DUMMY:IUser[] = [u1,u2];

/* ************************************************************** */

export const getUsers = (req:Request,res:Response,next:NextFunction) => {
    if(DUMMY.length === 0)
    {
        return next(new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Not_Found));
    }
    res.status(HTTP_RESPONSE_STATUS.OK).json({users: DUMMY});
}

export const login = (req:Request,res:Response,next:NextFunction) => {
    const errors = validationResult(req);
    console.log(errors);
    
    if(!errors.isEmpty())
    {
        return next(new HttpError(ERROR_INVALID_INPUTS, HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }

    const {email, password} = req.body;

    const targetUser = DUMMY.find(e => e.email === email);
    if(targetUser && targetUser.password === password)
    {
        res.status(HTTP_RESPONSE_STATUS.OK).json();
    }

    return next(new HttpError(ERROR_INVALID_DATA, HTTP_RESPONSE_STATUS.Unauthorized));
}

export const signup = (req:Request,res:Response,next:NextFunction) => {
    const errors = validationResult(req);
    console.log(errors);
    
    if(!errors.isEmpty())
    {
        return next(new HttpError(ERROR_INVALID_INPUTS, HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }

    const newUser = req.body as IUser;
    const alreadySigned = DUMMY.find( u => u.email === newUser.email);

    if(alreadySigned){
        return next(new HttpError(ERROR_EMAIL_EXIST, HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }

    newUser.id = uuidv4();
    newUser.placesCount = 0;
    DUMMY.push(newUser);

    res.status(HTTP_RESPONSE_STATUS.Created).json({user: newUser});
}