import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/db.js";
import {Server} from "socket.io"
import {createServer} from "http"
import {v4 as uuid} from "uuid"

import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { Message } from "./models/message.Models.js";

dotenv.config({
  path:"./.env",
})


const adminSecretKey = process.env.ADMIN_SECRET_KEY||"bhasgcdancvgahc";
const userSocketIDs = new Map(); 
connectDB(process.env.MONGO_URI);

const envMode = process.env.NODE_ENV || "PRODUCTION"
const port  = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server,{

})

app.use(express.json());
app.use(cookieParser());

app.use("/user",userRoutes);
app.use("/chat",chatRoutes);
app.use("/admin",adminRoutes);

app.get("/",(req,res)=>{
  res.send("HELLO WORLD")
})

io.use((socket,next)=>{
  
})
// socket == client , io==server 
io.on("connection",(socket)=>{

  const user = {
    _id:"ajhffds",
    name:"agvddc"
  };
  userSocketIDs.set(user._id.toString(),socket.id)
  console.log("a user connected",socket.id);

  socket.on(NEW_MESSAGE,async({chatId,members,message})=>{

    const messageForRealTime = {
      content:message,
      _id:uuid(),
      sender:{
        _id:user._id,
        name:user.name
      },
      chatId,
      createdAt: new Date().toISOString()
    }

    const messageForDB = {
      content:message,
      sender:user._id,
      chat:chatId,
    }

    const membersSocket = getSockets(members)
    io.to(membersSocket).emit(NEW_MESSAGE,{
      chatId,
      message:messageForRealTime,
    })

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId})

    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  })
  socket.on("disconnect",()=>{
    console.log("User disconnected");
    userSocketIDs.delete(user._id.toString());
  })
})

app.use(errorMiddleware);

server.listen(port,()=>{
  console.log(`Server is running on port ${port} in ${envMode} Mode`);
})


export {adminSecretKey,userSocketIDs}