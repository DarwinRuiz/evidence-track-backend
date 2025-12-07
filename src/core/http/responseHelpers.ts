import type { Response } from 'express';
import type { ApiResponse } from './ApiResponse';

export const sendSuccess = <T>(
    response: Response,
    statusCode: number,
    data: T,
    message?: string
): Response<ApiResponse<T>> => {
    return response.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (
    response: Response,
    statusCode: number,
    message: string,
    errorCode?: string
): Response<ApiResponse<null>> => {
    return response.status(statusCode).json({
        success: false,
        message,
        errorCode,
        data: null,
    });
};
