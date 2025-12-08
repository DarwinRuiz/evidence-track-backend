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

const coordinatorOrAdministrator = createRoleAuthorizationMiddleware([
    'COORDINATOR',
    'ADMINISTRATOR',
]);

RoleRouter.post(
    '/',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(createRoleValidation),
    createRole
);

RoleRouter.put(
    '/:roleId',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(updateRoleValidation),
    updateRole
);

RoleRouter.delete(
    '/:roleId',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(deleteRoleValidation),
    deleteRole
);

RoleRouter.get(
    '/:roleId',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(getRoleByIdValidation),
    getRoleById
);

RoleRouter.get(
    '/',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    validateRequest(listRolesValidation),
    listRoles
);

RoleRouter.get(
    '/count/total',
    authenticationMiddleware,
    coordinatorOrAdministrator,
    getTotalRoleCount
);

export default RoleRouter;
