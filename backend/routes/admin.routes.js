import express from "express";
import { adminLogout,adminLogin, allChats, allMessages, allUsers, getDashboardStats, verifyAdmin } from "../controllers/admin.controllers.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";


const app = express.Router();


app.post("/verify",adminLoginValidator(),validateHandler,adminLogin);

app.get("/logout", adminLogout);

// Only Admin can access this routes

app.use(adminOnly);

app.get("/",verifyAdmin);

app.get("/users",allUsers);

app.get("/chats",allChats);

app.get("/messages",allMessages);

app.get("/stats",getDashboardStats);


export default app;