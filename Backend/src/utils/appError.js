import { HTTPSTATUS } from "../config/http.config.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";

// Base Error Class
export class AppError extends Error {
    constructor(message, statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR, errorCode = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

// HTTP Exception Class
export class HttpException extends AppError {
    constructor(message = "Http Exception Error", statusCode, errorCode = null) {
        super(message, statusCode, errorCode);
    }
}

// Internal Server Error Exception
export class InternalServerException extends AppError {
    constructor(message = "Internal Server Error", errorCode = null) {
        super(
            message,
            HTTPSTATUS.INTERNAL_SERVER_ERROR,
            errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR
        );
    }
}

// Not Found Exception
export class NotFoundException extends AppError {
    constructor(message = "Resource not found", errorCode = null) {
        super(
            message,
            HTTPSTATUS.NOT_FOUND,
            errorCode || ErrorCodeEnum.RESOURCE_NOT_FOUND
        );
    }
}

// Bad Request Exception
export class BadRequestException extends AppError {
    constructor(message = "Bad Request", errorCode = null) {
        super(
            message,
            HTTPSTATUS.BAD_REQUEST,
            errorCode || ErrorCodeEnum.VALIDATION_ERROR
        );
    }
}

// Unauthorized Exception
export class UnauthorizedException extends AppError {
    constructor(message = "Unauthorized Access", errorCode = null) {
        super(
            message,
            HTTPSTATUS.UNAUTHORIZED,
            errorCode || ErrorCodeEnum.ACCESS_UNAUTHORIZED
        );
    }
}
