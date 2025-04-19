import express from "express";
import { acceptFriendRequest, 
    getMyProfile, 
    login, logout, 
    newUser, searchUser, 
    sendFriendRequest,getMyNotifications, 
    getMyFriends} from "../controllers/user.controllers.js";
import {  singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { loginValidator, registerValidator,
    sendFriendRequestValidator,validateHandler,acceptFriendRequestValidator
} from "../lib/validators.js";


const app = express.Router();

app.post("/new",singleAvatar,registerValidator(),validateHandler,newUser)
app.post("/login",loginValidator(),validateHandler,login);

// After here user must be logged in to access the routes
app.use(isAuthenticated); // before all routes it used in all ass middleware
app.get("/me",getMyProfile)

app.get("/logout",logout)

app.get("/search",searchUser);

app.put("/sendrequest",sendFriendRequestValidator(),validateHandler,sendFriendRequest)

app.put("/acceptrequest",acceptFriendRequestValidator(),validateHandler,acceptFriendRequest)

app.get("/notifications",getMyNotifications)

app.get("/friends", getMyFriends)

export default app;