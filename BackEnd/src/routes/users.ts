import express from 'express';
import { check } from 'express-validator';
import { getUsers, login, signup } from '../controllers/users';
import { HTTP_RESPONSE_STATUS } from '../types/enums';

/* ************************************************************** */

export const usersRoutes = express.Router();


usersRoutes.get('/', getUsers);

usersRoutes.post('/signup', [check('name').not().isEmpty(), check('email').normalizeEmail().isEmail(), check('password').isLength({min: 8})], signup);

usersRoutes.post('/login', [check('email').normalizeEmail().isEmail(), check('password').isLength({min: 8})], login);