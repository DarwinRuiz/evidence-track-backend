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

const coordinatorOrAdministrator = createRoleAuthorizationMiddleware([
    'COORDINATOR',
    'ADMINISTRATOR',
]);

userRouter.post(
    '/',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(createUserValidation),
    createUser
);

userRouter.put(
    '/:userId',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(updateUserValidation),
    updateUser
);

userRouter.delete(
    '/:userId',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(deleteUserValidation),
    deleteUser
);

userRouter.get(
    '/:userId',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(getUserByIdValidation),
    getUserById
);

userRouter.get(
    '/',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(listUsersValidation),
    listUsers
);

userRouter.get(
    '/count/total',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    getTotalUserCount
);

export default userRouter;
