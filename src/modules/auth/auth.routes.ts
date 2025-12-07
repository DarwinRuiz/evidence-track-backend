// src/modules/auth/auth.routes.ts
import { Router } from 'express';
import { authenticationMiddleware } from '../../middlewares/auth.middleware';
import { validateRequest } from '../../middlewares/validation.middleware';
import { getAuthenticatedUserProfile, login } from './auth.controller';
import { loginValidation } from './auth.validators';

const authRouter: Router = Router();

authRouter.post('/login', validateRequest(loginValidation), login);

authRouter.get(
    '/profile',
    authenticationMiddleware,
    getAuthenticatedUserProfile
);

export default authRouter;
