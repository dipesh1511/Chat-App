import express from "express";
import { addMembers, deleteGroup, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMember, renameGroup, sendAttachments } from "../controllers/chat.controllers.js";
import { addMemberValidator, chatIdValidator, newGroupValidator, removeMemberValidator, renameGroupValidator, sendAttachmentValidator, validateHandler } from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { attachmentsMulter } from "../middlewares/multer.js";


const app = express.Router();


// After here user must be logged in to access the routes
app.use(isAuthenticated); // before all routes it used in all ass middleware

app.post("/new",newGroupValidator(),validateHandler,newGroupChat)

app.get("/my",getMyChats)

app.get("/my/groups",getMyGroups)

app.put("/addmembers",addMemberValidator(),validateHandler,addMembers)

app.put("/removemember",removeMemberValidator(),validateHandler,removeMember)

app.delete("/leave/:id",chatIdValidator(),validateHandler,leaveGroup)

app.post("/message",attachmentsMulter,sendAttachmentValidator(),validateHandler,sendAttachments)

app.get("/message/:id",chatIdValidator(),validateHandler,getMessages)

app.route("/:id").get(chatIdValidator(),validateHandler,getChatDetails).put(renameGroupValidator(),validateHandler,renameGroup).delete(chatIdValidator(),validateHandler,deleteGroup);


export default app;