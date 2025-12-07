import { Router } from 'express';
import { authenticationMiddleware } from '../../middlewares/auth.middleware';
import { createRoleAuthorizationMiddleware } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validation.middleware';
import {
    createUser,
    deleteUser,
    getTotalUserCount,
    getUserById,
    listUsers,
    updateUser,
} from './user.controller';
import {
    createUserValidation,
    deleteUserValidation,
    getUserByIdValidation,
    listUsersValidation,
    updateUserValidation,
} from './user.validators';

const userRouter: Router = Router();

const coordinatorOnly = createRoleAuthorizationMiddleware(['COORDINATOR']);

userRouter.post(
    '/',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(createUserValidation),
    createUser
);

userRouter.put(
    '/:userId',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(updateUserValidation),
    updateUser
);

userRouter.delete(
    '/:userId',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(deleteUserValidation),
    deleteUser
);

userRouter.get(
    '/:userId',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(getUserByIdValidation),
    getUserById
);

userRouter.get(
    '/',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(listUsersValidation),
    listUsers
);

userRouter.get(
    '/count/total',
    authenticationMiddleware,
    coordinatorOnly,
    getTotalUserCount
);

export default userRouter;
