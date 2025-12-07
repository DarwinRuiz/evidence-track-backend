import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../core/http/ApiError';

export const createRoleAuthorizationMiddleware = (
    allowedRoleNames: string[]
) => {
    return (
        request: Request,
        response: Response,
        nextFunction: NextFunction
    ) => {
        if (!(request as Request & { user?: { roleName: string } }).user) {
            return nextFunction(
                ApiError.unauthorized(
                    'User is not authenticated',
                    'MISSING_AUTH_USER'
                )
            );
        }

        const userRoleName = (
            request as Request & { user?: { roleName: string } }
        ).user!.roleName;

        if (!allowedRoleNames.includes(userRoleName)) {
            return nextFunction(
                ApiError.forbidden(
                    'User does not have permission to perform this action',
                    'INSUFFICIENT_ROLE'
                )
            );
        }

        return nextFunction();
    };
};
