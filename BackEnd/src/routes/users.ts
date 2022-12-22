import express from 'express';
import { HTTP_RESPONSE_STATUS } from '../types/enums';

/* ************************************************************** */

export const usersRoutes = express.Router();

usersRoutes.get('/:placeId',(req,res) => {
    console.log('get REQ in Places');
    res.status(HTTP_RESPONSE_STATUS.OK).json({text: 'it Work!'});
});
