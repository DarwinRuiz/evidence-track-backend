import type { NextFunction, Request, Response } from 'express';
import type { ZodError } from 'zod';
import { ApiError } from '../core/http/ApiError';
import type { ValidationErrorItem } from '../core/http/ApiResponse';

interface ValidationSchemas {
    bodySchema?: Record<string, any>;
    paramsSchema?: Record<string, any>;
    querySchema?: Record<string, any>;
}

export const validateRequest = (validationSchemas: ValidationSchemas) => {
    return (
        request: Request,
        response: Response,
        nextFunction: NextFunction
    ) => {
        try {
            if (validationSchemas.bodySchema) {
                request.body = validationSchemas.bodySchema.parse(request.body);
            }

            if (validationSchemas.paramsSchema) {
                request.params = validationSchemas.paramsSchema.parse(
                    request.params
                );
            }

            if (validationSchemas.querySchema) {
                request.query = validationSchemas.querySchema.parse(
                    request.query
                );
            }

            return nextFunction();
        } catch (rawError) {
            if (isZodError(rawError)) {
                const validationErrorsList: ValidationErrorItem[] =
                    rawError.issues.map((issue) => ({
                        field: issue.path.join('.') || 'root',
                        message: issue.message,
                    }));

                const apiError = ApiError.badRequest(
                    'Validation error',
                    'VALIDATION_ERROR'
                );

                apiError.validationErrors = validationErrorsList;

                return nextFunction(apiError);
            }

            return nextFunction(rawError);
        }
    };
};

const isZodError = (possibleError: unknown): possibleError is ZodError => {
    return (
        typeof possibleError === 'object' &&
        possibleError !== null &&
        'issues' in possibleError
    );
};
