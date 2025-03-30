import Router from 'koa-router';
import { getUsers, getTokens } from '../controllers/userController.js';

export const userRouter = new Router();

userRouter.get('/users', getUsers);
userRouter.get('/tokens', getTokens);
