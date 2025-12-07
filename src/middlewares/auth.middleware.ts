import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../core/http/ApiError';
import { jwtSecurity } from '../core/security/jwt';

export const authenticationMiddleware = (
    request: Request,
    response: Response,
    nextFunction: NextFunction
) => {
    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) {
        return nextFunction(
            ApiError.unauthorized(
                'Missing Authorization header',
                'MISSING_AUTH_HEADER'
            )
        );
    }

    const tokenParts = authorizationHeader.split(' ');

    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return nextFunction(
            ApiError.unauthorized(
                'Invalid Authorization header format',
                'INVALID_AUTH_FORMAT'
            )
        );
    }

    const accessToken = tokenParts[1];

    if (!accessToken) {
        return nextFunction(
            ApiError.unauthorized(
                'Missing access token',
                'MISSING_ACCESS_TOKEN'
            )
        );
    }

    try {
        const tokenPayload = jwtSecurity.verifyAccessToken(accessToken);
        const temporalRequest = request as Request & {
            user?: typeof tokenPayload;
        };
        temporalRequest.user = tokenPayload;
        request = temporalRequest;
        return nextFunction();
    } catch {
        return nextFunction(
            ApiError.unauthorized(
                'Invalid or expired access token',
                'INVALID_TOKEN'
            )
        );
    }
};
