import express from 'express';
import { createPlace, deletePlace, getPlaceById, getPlacesByUserId, updatePlace } from '../controllers/places';
import { check } from 'express-validator'

/* ************************************************************** */

export const placesRoutes = express.Router();

placesRoutes.get('/:placeId', getPlaceById);

placesRoutes.get('/user/:userId', getPlacesByUserId);

placesRoutes.post('/', [check('title').not().isEmpty(), check('description').isLength({min: 5}), check('address').not().isEmpty()], createPlace);

placesRoutes.patch('/:placeId', [check('title').not().isEmpty(), check('description').isLength({min: 5})],updatePlace);

placesRoutes.delete('/:placeId', deletePlace);
