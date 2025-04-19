import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true,
    sameSite:"none",
}


const connectDB = (uri) =>{
    mongoose.connect(uri,{dbName:"Chattu"})
    .then((data)=>console.log(`Connected to DB ${data.connection.host}`))
    .catch((err)=>{
        throw err;
    })
}

const sendToken = (res,user,code,message) => {
    const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
   
    return res.status(code).cookie("chattu-token", token, cookieOptions).json({
        success: true,
        message,
    });
};

const emitEvent = (req,event,users,data) => {
    console.log("req.socket.id",event);
}

const deleteFilesFromCloudinary = async(public_ids) => {
    // import cloudinary from "cloudinary"
};
export {connectDB,sendToken,cookieOptions,emitEvent,deleteFilesFromCloudinary};