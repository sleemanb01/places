import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';

import { HttpError } from '../models/http-error';
import { HTTP_RESPONSE_STATUS } from '../types/enums';
import { place } from '../types/interfaces';
import { ERROR_INVALID_ID, ERROR_INVALID_INPUTS } from '../util/errorMessages';
import { getCoordsForAddress } from '../util/location';

/* ************************************************************** */

const p1 = {
    id: "1",
    creatorId: "1",
    title: "Empire state building",
    description: "one of the most popular sky scrapers on the world",
    address: "20 W 34th st, New York, NY 10001",
    coordinate: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
  };

  const p2:place = {
    id: "2",
    creatorId: "1",
    title: "Azrieli Center",
    description: "one of the most popular building in israel",
    address: "Derech Menachem Begin, Tel Aviv-Yafo",
    coordinate: {
      lat: 32.0740769,
      lng: 34.7900141,
    },
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg",
  };
let DUMMY:place[] = [p1,p2];

/* ************************************************************** */

export const getPlaceById = (req:Request,res:Response,next:NextFunction) => {
    const placeId = req.params.placeId;
    const place = DUMMY.find(p => p.id === placeId);
    
    if(!place)
    {
      return next(new HttpError(ERROR_INVALID_ID, HTTP_RESPONSE_STATUS.Not_Found));
    }

    res.status(HTTP_RESPONSE_STATUS.OK).json({place});
}

export const getPlacesByUserId = (req:Request,res:Response,next:NextFunction) => {
    const userId = req.params.userId;
    const places = DUMMY.filter(p => p.creatorId === userId);
    
    if(places.length === 0)
    {
      return next(new HttpError(ERROR_INVALID_ID, HTTP_RESPONSE_STATUS.Not_Found));
    }
  
    res.status(HTTP_RESPONSE_STATUS.OK).json({places});
  }

  export const createPlace = async (req:Request,res:Response,next:NextFunction) => {

    const errors = validationResult(req);
    console.log(errors);
    
    if(!errors.isEmpty())
    {
        return next(new HttpError(ERROR_INVALID_INPUTS, HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }

    const { title, description,address, creatorId } = req.body;
    let coordinate;
    
    try{
      coordinate = await getCoordsForAddress(address);
    }
    catch(error){
      return next(error);
    }

    const newPlace:place = {
      id:uuidv4(),
      title,
      description,
      coordinate,
      address,
      creatorId,
    };

    DUMMY.push(newPlace);

    res.status(HTTP_RESPONSE_STATUS.Created).json({place:newPlace});
  }

  export const updatePlace = (req:Request,res:Response,next:NextFunction) => {

    const errors = validationResult(req);
    console.log(errors);
    
    if(!errors.isEmpty())
    {
        return next(new HttpError(ERROR_INVALID_INPUTS, HTTP_RESPONSE_STATUS.Unprocessable_Entity));
    }
    
    const { title, description } = req.body;
    const placeId = req.params.placeId;
    const updatedPlace = { ...DUMMY.find(p => p.id === placeId) };
    if(updatedPlace === undefined)
    {
      return next(new HttpError(ERROR_INVALID_ID, HTTP_RESPONSE_STATUS.Not_Found));
    }

    const index = DUMMY.findIndex(p => p.id === placeId);
    updatedPlace.title = title;
    updatedPlace.description = description;

    DUMMY[index] = updatedPlace as place;

    res.status(HTTP_RESPONSE_STATUS.OK).json({place:updatedPlace});
    
  }

  export const deletePlace = (req:Request,res:Response,next:NextFunction) => {
    const placeId = req.params.placeId;
    const targetPlace = DUMMY.find(p => p.id !== placeId);
    if(targetPlace === undefined)
    {
      return next(new HttpError(ERROR_INVALID_ID, HTTP_RESPONSE_STATUS.Not_Found));
    }
    DUMMY = DUMMY.filter(e => e.id !== placeId);
    res.status(HTTP_RESPONSE_STATUS.OK).json();
  }
