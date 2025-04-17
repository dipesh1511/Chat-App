import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import {User} from "../models/user.Models.js"
import { cookieOptions, sendToken } from "../utils/db.js"
import bcrypt from "bcrypt"

const newUser = async (req,res) =>{

    const {name, username,password,bio} = req.body;

    const avatar = {public_id:"abhvs",url:"avgvs"};
    const user = await User.create(
        {name,bio,
            username,password,avatar,})

    sendToken(res,user,201,"User created");
}

        
const login = TryCatch(async(req,res,next) =>{
    
    const {username,password} = req.body;
    // Check if username and password are provided

    const user = await User.findOne({ username }).select("+password"); 
    
    if(!user) return next(new ErrorHandler("Invalid username or Password",404));
    // Check if password is correct
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return next(new ErrorHandler("Invalid username or Password", 404));
    
    sendToken(res,user,200,`welcome back ${user.name}`);

})

const getMyProfile = TryCatch(async (req,res) =>{

    const user = await User.findById(req.user);
    res.status(200).json({
        success:true,
        user,
    })
});


const logout = TryCatch(async (req,res) =>{
    return res.status(200).cookie("chattu-token","",{...cookieOptions,maxAge:0}).json({
        success:true,
        message:"Logged out successfully",
    })
});

const searchUser = TryCatch(async (req,res) =>{
    const {name} = req.query;

    return res.status(200).json({
        success:true,
        message:name,
    })
});
export {login,newUser,getMyProfile,logout,searchUser};