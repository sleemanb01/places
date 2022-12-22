import express from 'express';
import { createPlace, deletePlace, getPlaceById, getPlacesByUserId, updatePlace } from '../controllers/places';

/* ************************************************************** */

export const placesRoutes = express.Router();

placesRoutes.get('/:placeId', getPlaceById);

placesRoutes.get('/user/:userId', getPlacesByUserId);

placesRoutes.post('/', createPlace);

placesRoutes.patch('/:placeId', updatePlace);

placesRoutes.delete('/:placeId', deletePlace);
