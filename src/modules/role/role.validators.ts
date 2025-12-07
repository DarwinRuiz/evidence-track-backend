import {
    createRoleBodySchema,
    listRolesQuerySchema,
    roleIdParamsSchema,
    updateRoleBodySchema,
} from './role.model';

export const createRoleValidation = {
    bodySchema: createRoleBodySchema,
};

export const updateRoleValidation = {
    paramsSchema: roleIdParamsSchema,
    bodySchema: updateRoleBodySchema,
};

export const getRoleByIdValidation = {
    paramsSchema: roleIdParamsSchema,
};

export const deleteRoleValidation = {
    paramsSchema: roleIdParamsSchema,
};

export const listRolesValidation = {
    querySchema: listRolesQuerySchema,
};
