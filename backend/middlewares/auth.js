import { adminSecretKey } from "../server.js";
import { ErrorHandler } from "../utils/utility.js";

import jwt from "jsonwebtoken";

const isAuthenticated =  (req, res, next) => {
    const token = req.cookies["chattu-token"];

    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decodedData._id;

    next();
};


const adminOnly =  (req, res, next) => {
    const token = req.cookies["chattu-admin-token"];

    if (!token) {
        return next(new ErrorHandler("Only Admin can access this route", 401));
    }

    const secretKey = jwt.verify(token, process.env.JWT_SECRET);
    
    const isMatch = secretKey === adminSecretKey

    if(!isMatch) return next(new ErrorHandler("Only Admin can access this route", 401));

    next();
};


export { isAuthenticated , adminOnly };