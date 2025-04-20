import {TryCatch} from '../middlewares/error.js';
import { Chat } from '../models/chat.Models.js';
import jwt from 'jsonwebtoken';
import { Message } from '../models/message.Models.js';
import {User} from '../models/user.Models.js';
import { ErrorHandler } from '../utils/utility.js';
import { cookieOptions } from '../utils/db.js';
import { adminSecretKey } from '../app.js';


const adminLogin = TryCatch(async (req,res,next) => {
    const {secretKey} = req.body;

    const isMatch = secretKey === adminSecretKey;

    if(!isMatch) return next(new ErrorHandler("Invalid Secret Key",401));

    const token = jwt.sign( secretKey , process.env.JWT_SECRET);

    return res.status(200).cookie("chattu-admin-token", token,{
        ...cookieOptions,
        maxAge: 1000 * 60 * 15, // 15 minutes for login
    })
    .json({
        status:"success",
        message:"Login Successfully Welcome back BOSS",
    })
});

const adminLogout = TryCatch(async (req,res,next) => {

    return res.status(200).cookie("chattu-admin-token", "",{
        ...cookieOptions,
        maxAge: 0, // 15 minutes for login
    })
    .json({
        status:"success",
        message:"Logout Successfully",
    })
});

const verifyAdmin = TryCatch(async (req,res,next) => {

    return res.status(200).json({
        admin: true,
        message: "Admin verified successfully",
    });
})


const allUsers = TryCatch(async (req,res) => {
    const users = await User.find({});

    const transformedUsers = await Promise.all(
        users.map(
            async({name,username,avatar,_id})=>{
                const [groups,friends] = await Promise.all([
                    Chat.countDocuments({groupChat:true,members:_id}),
                    Chat.countDocuments({isGroupChat:false,members:_id})
                ])
    
                return {
                    name,
                    username,
                    avatar,
                    _id,
                    groups,
                    friends
                }
            }
        )
    )
    
    return res.status(200).json({
        status:"success",
        users:transformedUsers,
    })
});

const allChats = TryCatch(async (req,res) => {
    const chats = await Chat.find({}).populate("members","name avatar")
    .populate("creator","name avatar");

    const transformedChats = await Promise.all(
        chats.map(
            async({name,groupChat,members,creator,_id})=>{
                
                const totalMessages = await Message.countDocuments({chat:_id});
    
                return {
                    _id,
                    name,
                    groupChat,
                    avatar: members.slice(0,3).map((member)=>member.avatar.url),
                    members : members.map(({_id,name,avatar})=>({
                         _id, name, avatar:avatar.url })),
                    creator:{
                        name:creator?.name || "None",
                        avatar:creator?.avatar.url || "",
                    },
                    totalMembers:members.length,
                    totalMessages,
                }
            }
        )
    )
    return res.status(200).json({
        status:"success",
        chats:transformedChats,
    });
});


const allMessages = TryCatch(async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

    const transformedMessages = messages.map(
        ({createdAt,sender,chat,content,_id,attachments})=>{
                
            return {
                    _id,
                    attachments,
                    content,
                    createdAt,
                    chat:chat?._id ||null,
                    groupChat:chat?.groupChat||false,
                    sender:{
                        _id:sender?._id,
                        name:sender.name,
                        avatar:sender?.avatar?.url||"",
                    },
                    
                }
})

  return res.status(200).json({
    success: true,
    messages: transformedMessages,
  });
});


const getDashboardStats = TryCatch(async (req,res) => {

    const [groupsCount, usersCount, messagesCount, totalChatsCount] = await Promise.all([
        Chat.countDocuments({groupChat:true}),
        User.countDocuments(),
        Message.countDocuments(),
        Chat.countDocuments(),
    ])


    const today = new Date();

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const last7DaysMessages = await Message.find({
        createdAt: {
            $gte: last7Days,
            $lte: today,
        },
    }).select("createdAt");

    const messages = new Array(7).fill(0);

    last7DaysMessages.forEach((message) => {
        const indexApprox = (today.getDate() - message.createdAt.getDate())/(1000*60*60*24);
        const index = Math.floor(indexApprox);
        messages[6-index]++;
    });

    const stats = {
        groupsCount,
        usersCount,
        messagesCount,
        totalChatsCount,
        messagesChart: messages,
    }   

    return res.status(200).json({
        status:"success",
        stats,
    })
})

export {allUsers,allChats, allMessages, getDashboardStats,adminLogin,adminLogout,verifyAdmin};