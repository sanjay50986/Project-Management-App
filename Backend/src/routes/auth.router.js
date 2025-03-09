import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config.js";
import { 
    googleLoginCallback, 
    loginController, 
    logoutController, 
    registerUserController 
} from "../controllers/auth.controller.js";


const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRouter = Router();

authRouter.post("/register", registerUserController)
authRouter.post("/login", loginController)

authRouter.post("/logout", logoutController)

authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

authRouter.get("/google/callback", 
    passport.authenticate("google", {
        failureRedirect: failedUrl
    }),

    googleLoginCallback
);

export default authRouter
