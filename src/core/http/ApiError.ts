export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly errorCode?: string;

    public validationErrors?: any;

    private constructor(
        statusCode: number,
        message: string,
        errorCode?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode!;
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static badRequest(message = 'Bad request', errorCode?: string): ApiError {
        return new ApiError(400, message, errorCode);
    }

    static unauthorized(
        message = 'Unauthorized',
        errorCode?: string
    ): ApiError {
        return new ApiError(401, message, errorCode);
    }

    static forbidden(message = 'Forbidden', errorCode?: string): ApiError {
        return new ApiError(403, message, errorCode);
    }

    static notFound(message = 'Not found', errorCode?: string): ApiError {
        return new ApiError(404, message, errorCode);
    }

    static internal(
        message = 'Internal server error',
        errorCode?: string
    ): ApiError {
        return new ApiError(500, message, errorCode);
    }
}
