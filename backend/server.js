import express from "express"
import { connectDB } from "./utils/db.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chat.routes.js"

dotenv.config({
  path:"./.env",
})

connectDB(process.env.MONGO_URI);  

const port  = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/user",userRoutes);
app.use("/chat",chatRoutes);

app.get("/",(req,res)=>{
  res.send("HELLO WORLD")
})

app.use(errorMiddleware);

app.listen(port,()=>{
  console.log(`Server is running on port ${port}`);
})