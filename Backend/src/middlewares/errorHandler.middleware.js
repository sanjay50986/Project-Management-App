import { ZodError } from "zod";
import { HTTPSTATUS } from "../config/http.config.js";
import { AppError } from "../utils/appError.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";


const formatZodError = (res, err) => {
    const errors = err?.issues?.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
    }));

    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        error: errors,
        errorCode: ErrorCodeEnum.VALIDATION_ERROR
    });
};

export const errorHandler = (error, req, res, next) => {
    console.error(`Error Occured on PATH: ${req.path}`, error);
    if(error instanceof SyntaxError) {
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invaild JSON format. Please check your request body"
        })
    };

    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            errorCode: error.errorCode,
        });
    }


    if(error instanceof ZodError) {
        return formatZodError(res, error);
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message: "Internal Server Error",
        error: error?.message || "Unknown error occurred"
    });
};

