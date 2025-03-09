import "dotenv/config";
import express from 'express';
import cors from 'cors';
import passport from "passport";
import session from 'cookie-session';
import { config } from "./config/app.config.js";
import connectDatabase from "./config/database.config.js";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import { HTTPSTATUS } from "./config/http.config.js";
import { asyncHandler } from "./middlewares/asyncHandler.middleware.js";
import { BadRequestException } from "./utils/appError.js";
import { ErrorCodeEnum } from "./enums/error-code.enum.js";
import "./config/passport.config.js"
import authRouter from "./routes/auth.router.js";
import userRouter from "./routes/user.router.js";
import isAuthenticated from "./middlewares/isAuthenticated.middleware.js";
import workspaceRouter from "./routes/workspace.router.js";
import memberRouter from "./routes/member.router.js";
import projectRouter from "./routes/project.router.js";
import taskRouter from "./routes/task.router.js";

const app = express();
const BASE_PATH = config.BASE_PATH;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        name: "session",
        keys: [config.SESSION_SECRET],
        maxAge: 24 * 60 * 60 * 1000,
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: "lax"
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: config.FRONTEND_ORIGIN,
        credentials: true,
    })
);



app.get('/', asyncHandler(async (req, res, next) => {
    throw new BadRequestException("This is bad request", ErrorCodeEnum.AUTH_INVALID_TOKEN);
    return res.status(HTTPSTATUS.OK).json({
        message: "Hello"
    });
}));

app.use(`${BASE_PATH}/auth`, authRouter)
app.use(`${BASE_PATH}/user`, isAuthenticated,  userRouter);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRouter)
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRouter)
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRouter)
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRouter)





app.use(errorHandler);



app.listen(config.PORT, async () => {
    console.log(`server listening on port ${config.PORT} in ${config.NODE_ENV}`);
    await connectDatabase();
})