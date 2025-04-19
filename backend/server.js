import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/db.js";

import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { createMessageInAChat } from "./seeders/chat.js";

dotenv.config({
  path:"./.env",
})


export const adminSecretKey = process.env.ADMIN_SECRET_KEY||"bhasgcdancvgahc";
connectDB(process.env.MONGO_URI);

const envMode = process.env.NODE_ENV || "PRODUCTION"
const port  = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/user",userRoutes);
app.use("/chat",chatRoutes);
app.use("/admin",adminRoutes);

app.get("/",(req,res)=>{
  res.send("HELLO WORLD")
})

app.use(errorMiddleware);

app.listen(port,()=>{
  console.log(`Server is running on port ${port} in ${envMode} Mode`);
})