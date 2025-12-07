import type { NextFunction, Request, Response } from 'express';
import { logger } from '../config/logger';
import { ApiError } from '../core/http/ApiError';
import type { ValidationErrorItem } from '../core/http/ApiResponse';

export const errorMiddleware = (
    error: unknown,
    request: Request,
    response: Response,
    nextFunction: NextFunction
): Response => {
    if (error instanceof ApiError) {
        const apiError = error as ApiError & {
            validationErrors?: ValidationErrorItem[];
        };

        if (apiError.statusCode >= 500) {
            logger.error('Internal ApiError encountered', {
                message: apiError.message,
                errorCode: apiError.errorCode,
            });
        }

        return response.status(apiError.statusCode).json({
            success: false,
            message: apiError.message,
            errorCode: apiError.errorCode,
            data: null,
            validationErrors: apiError.validationErrors,
        });
    }

    logger.error('Unexpected error encountered', { error });

    return response.status(500).json({
        success: false,
        message: 'Unexpected error',
        errorCode: 'UNEXPECTED_ERROR',
        data: null,
    });
};
