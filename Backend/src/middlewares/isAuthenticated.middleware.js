import { UnauthorizedException } from "../utils/appError.js"

const isAuthenticated = (req, res, next) => {
    if(!req.user || !req.user._id ) {
        throw new UnauthorizedException("Unauthorized, Please Log on")
    }
    next();
}

export default isAuthenticated;