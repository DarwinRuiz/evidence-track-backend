import { Router } from 'express';
import { authenticationMiddleware } from '../../middlewares/auth.middleware';
import { createRoleAuthorizationMiddleware } from '../../middlewares/role.middleware';
import { validateRequest } from '../../middlewares/validation.middleware';
import {
    createRole,
    deleteRole,
    getRoleById,
    getTotalRoleCount,
    listRoles,
    updateRole,
} from './role.controller';
import {
    createRoleValidation,
    deleteRoleValidation,
    getRoleByIdValidation,
    listRolesValidation,
    updateRoleValidation,
} from './role.validators';

const RoleRouter: Router = Router();

const coordinatorOnly = createRoleAuthorizationMiddleware(['COORDINATOR']);

RoleRouter.post(
    '/',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(createRoleValidation),
    createRole
);

RoleRouter.put(
    '/:roleId',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(updateRoleValidation),
    updateRole
);

RoleRouter.delete(
    '/:roleId',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(deleteRoleValidation),
    deleteRole
);

RoleRouter.get(
    '/:roleId',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(getRoleByIdValidation),
    getRoleById
);

RoleRouter.get(
    '/',
    authenticationMiddleware,
    coordinatorOnly,
    validateRequest(listRolesValidation),
    listRoles
);

RoleRouter.get(
    '/count/total',
    authenticationMiddleware,
    coordinatorOnly,
    getTotalRoleCount
);

export default RoleRouter;
