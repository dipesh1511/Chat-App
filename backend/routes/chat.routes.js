import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { sendAttachments,removeMember,addMembers, getMyChats, getMyGroups, newGroupChat, leaveGroup, getChatDetails } from "../controllers/chat.controllers.js";
import { attachmentsMulter } from "../middlewares/multer.js";


const app = express.Router();


// After here user must be logged in to access the routes
app.use(isAuthenticated); // before all routes it used in all ass middleware

app.post("/new",newGroupChat)

app.get("/my",getMyChats)

app.get("/my/groups",getMyGroups)

app.put("/addmembers",addMembers)

app.put("/removemember",removeMember)

app.delete("/leave/:chatId",leaveGroup)

app.post("/message",attachmentsMulter,sendAttachments)



app.route("/:id").get(getChatDetails).put().delete();
export default app;