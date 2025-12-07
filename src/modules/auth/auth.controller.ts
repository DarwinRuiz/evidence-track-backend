// src/modules/auth/auth.controller.ts
import type { Request, Response } from 'express';
import { sendSuccess } from '../../core/http/responseHelpers';
import { authService } from './auth.service';

export const login = async (request: Request, response: Response) => {
    const { token, user } = await authService.login(request.body);

    return sendSuccess(
        response,
        200,
        {
            token,
            user: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                roleName: user.roleName,
            },
        },
        'Authenticated successfully'
    );
};

export const getAuthenticatedUserProfile = async (
    request: Request,
    response: Response
) => {
    return sendSuccess(response, 200, {
        user: (request as Request & { user?: { roleName: string } }).user,
    });
};
