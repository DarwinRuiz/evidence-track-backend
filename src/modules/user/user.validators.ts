import {
    createUserBodySchema,
    listUsersQuerySchema,
    updateUserBodySchema,
    userIdParamsSchema,
} from './user.model';

export const createUserValidation = {
    bodySchema: createUserBodySchema,
};

export const updateUserValidation = {
    paramsSchema: userIdParamsSchema,
    bodySchema: updateUserBodySchema,
};

export const getUserByIdValidation = {
    paramsSchema: userIdParamsSchema,
};

export const deleteUserValidation = {
    paramsSchema: userIdParamsSchema,
};

export const listUsersValidation = {
    querySchema: listUsersQuerySchema,
};
