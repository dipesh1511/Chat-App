import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import {User} from "../models/user.Models.js"
import { cookieOptions, emitEvent, sendToken } from "../utils/db.js"
import bcrypt from "bcrypt"
import { Chat } from "../models/chat.Models.js";
import  {Request}  from "../models/request.Models.js";
import  {NEW_REQUEST, REFETCH_CHATS}  from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

const newUser = TryCatch(async (req,res) =>{
        const {name, username,password,bio} = req.body;
    
        const file = req.file;
    
        if(!file) return next(new ErrorHandler("Please Upload avatar"))
        
        const avatar = {
            public_id:"asbhgd",
            url:"smnsav",
        }
        const user = await User.create(
            {name,bio,
                username,password,avatar,})
    
        sendToken(res,user,201,"User created");
    }
)

        
const login = TryCatch(async(req,res,next) =>{
    
    const {username,password} = req.body;
    // Check if username and password are provided
    if(!username || !password) return next(new ErrorHandler("Please provide username and password",400));  

    const user = await User.findOne({ username }).select("+password"); 
    
    if(!user) return next(new ErrorHandler("Invalid username or Password",404));
    // Check if password is correct
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return next(new ErrorHandler("Invalid username or Password", 404));
    
    sendToken(res,user,200,`welcome back ${user.name}`);

})

const getMyProfile = TryCatch(async (req,res,next) =>{

    const user = await User.findById(req.user);

    if(!user) return next(new ErrorHandler("User not found",404));
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

    // finding all my chats
    const myChats = await Chat.find({groupChat:false,members:req.user});

    // extracting all users from my chats means friends or people I have chatted with
    const allUserFromMyChats = myChats.flatMap((chat) => chat.members);
    
    // finding all users except me and my friends
    const allUserExceptMeAndFriends = await User.find({
        _id:{$nin:allUserFromMyChats},
        name:{$regex:name,$options:"i"}
    });

    const users = allUserExceptMeAndFriends.map(({_id,name,avatar})=>({
        _id,
        name,
        avatar:avatar.url,
    }))

    return res.status(200).json({
        success:true,
        message:name,
        users,
    })
});

const sendFriendRequest = TryCatch(async (req,res,next) =>{
    const {userId} = req.body;

    const request = await Request.findOne({
        $or:[
            {sender:req.user,receiver:userId},
            {sender:userId,receiver:req.user}
        ]
    })
    if(request) return next(new ErrorHandler("You have already sent a friend request",400));

    await Request.create({
        sender:req.user,
        receiver:userId,
    });
    
    emitEvent(req,NEW_REQUEST,[userId]);

    return res.status(200).json({
        success: true,
        message: "Friend request sent successfully",
    });
})

const acceptFriendRequest = TryCatch(async (req,res,next) =>{
    const {requestId,accept} = req.body;

    const request = await Request.findById(requestId)
    .populate("sender","name")
    .populate("receiver","name");
    if(!request) return next(new ErrorHandler("Request not found",404));

    if(request.receiver._id.toString() !== req.user.toString()){ 
        return next(new ErrorHandler("You are not authorized to accept this request",401));
    }
   if(!accept){
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Friend request rejected successfully",
        });
   }

    const members = [request.sender._id,request.receiver._id];

    await Promise.all([
        Chat.create({
            name:`${request.sender.name}-${request.receiver.name}`,
            members,
        }),
        request.deleteOne(),
    ]);
    emitEvent(req,REFETCH_CHATS,members);

    return res.status(200).json({
        success: true,
        message: "Friend request accepted successfully",
        senderId:request.sender._id,
    });
});

const getMyNotifications = TryCatch(async (req,res) =>{
    const requests = await Request.find({
        receiver:req.user,
    }).populate("sender","name avatar")
    

    const allRequests = requests.map(({_id,sender})=>({
        _id,
        sender:{
            _id:sender._id,
            name:sender.name,
            avatar:sender.avatar.url,
        }
    }));

    return res.status(200).json({
        success:true,
        allRequests,
    });
});

const getMyFriends = TryCatch(async (req,res) =>{
    
    const chatId = req.query.chatId;

    const chats = await Chat.find({
        groupChat:false,
        members:req.user,
    }).populate("members","name avatar");

    const friends = chats.map(({members}) => {
        const otherUSer = getOtherMember(members,req.user);
        return {
            _id:otherUSer?._id,
            name:otherUSer.name,
            avatar:otherUSer.avatar?.url,
        }
    });

    if(chatId){
        const chat = await Chat.findById(chatId);
        
       const availableFriends = friends.filter((friend) => chat.members.includes(friend._id));
       
       return res.status(200).json({
            success:true,
            friends:availableFriends,
        });
    }
    else{
        return res.status(200).json({
            success:true,
            friends,
        }); 
    }
    
});

export {login,newUser,getMyProfile,logout,
    searchUser,sendFriendRequest,getMyNotifications,
    acceptFriendRequest,getMyFriends};