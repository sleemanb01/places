import express from 'express';
import { getUsers, login, signup } from '../controllers/users';
import { HTTP_RESPONSE_STATUS } from '../types/enums';

/* ************************************************************** */

export const usersRoutes = express.Router();


usersRoutes.get('/', getUsers);

usersRoutes.post('/signup', signup);

usersRoutes.post('/login', login);



