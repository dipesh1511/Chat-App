import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import {Chat} from "../models/chat.Models.js"
import { deleteFilesFromCloudinary, emitEvent } from "../utils/db.js";
import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.Models.js";
import { Message } from "../models/message.Models.js";


const newGroupChat = TryCatch(async (req, res,next) => {

    const { name, members } = req.body;

        const allMembers = [...members, req.user];

        await Chat.create({ 
            name, 
            groupChat:true,
            creator: req.user,
            members: allMembers
         });

        emitEvent(req, ALERT, allMembers, `Welcome to ${name} group!`);
        emitEvent(req, REFETCH_CHATS, members);

        return res.status(201).json({
            success: true,
            message: `Group chat ${name} created successfully`,
        });
});

const getMyChats = TryCatch(async (req, res,next) => {
    const chats = await Chat.find({ members:  req.user })
        .populate("members", "name avatar");

    const transformedChats = chats.map(({_id,name,members,groupChat}) => {
        
        const otherMember = getOtherMember(members, req.user);
        
        return {
            _id,
            groupChat,
            avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [otherMember.avatar.url],
            name: groupChat ? name : otherMember.name,
            members: members.reduce((prev, curr) => {
                if (curr._id.toString() !== req.user.toString()) {
                    prev.push(curr._id);
                }
                return prev;
            }, []),
        };
    });
    return res.status(200).json({
        success: true,
        chats: transformedChats,
    });
});

const getMyGroups = TryCatch(async (req, res,next) => {
    const chats = await Chat.find({
        members:  req.user, 
        groupChat: true,
        creator:req.user,    
    }).populate("members", "name avatar");

   const groups = chats.map(({_id,name,members,groupChat}) => ({
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url), 
    }));
    return res.status(200).json({
        success: true,
        groups,
    });
});

const addMembers = TryCatch(async (req, res,next) => {
    const { chatId, members } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }
    if (!chat.groupChat) {
        return next(new ErrorHandler("This is not a group chat", 400));
    }
    
    if(chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("Only creator can add members", 403));
    }
    const allnewMembersPromise = members.map((i)=>User.findById(i,"name"));

    const allnewMembers = await Promise.all(allnewMembersPromise);
    
    const uniqueMembers = allnewMembers
    .filter((i) =>  !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

    chat.members.push(...uniqueMembers);
    
    if(chat.members.length > 100) {
        return next(new ErrorHandler("Group members limit exceeded", 400));
    }

    await chat.save();

    const allUsersName = allnewMembers.map((i)=>i.name).join(", ");
    emitEvent(req, ALERT, chat.members, `${allUsersName} has been added in the group`);
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Members added successfully",
    });

   
});

const removeMember = TryCatch(async (req, res,next) => {
    const { userId, chatId } = req.body;
    const [chat,userThatWillBeRemoved] = await Promise.all([
        Chat.findById(chatId),
        User.findById(userId,"name")
    ]);
    
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }
    
    if (!chat.groupChat) {
        return next(new ErrorHandler("This is not a group chat", 400));
    }

    if(chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("Only creator can remove members", 403));
    }

    if(chat.members.length < 3) {
        return next(new ErrorHandler("Group must have at least 3 members", 400));
    }
    chat.members = chat.members.filter(member => member.toString() !== userId.toString());
    
    await chat.save();
    emitEvent(req, ALERT, chat.members, `${userThatWillBeRemoved.name} has been removed from the group`);
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Member removed successfully",
    });

   
});

const leaveGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));

    const remainingMembers = chat.members.filter(
        (member) => member.toString() !== req.user.toString()
    );

    if (remainingMembers.length < 3) {
        return next(new ErrorHandler("Group must have at least 3 members", 400));
    }

    if (chat.creator.toString() === req.user.toString()) {
        const randomIndex = Math.floor(Math.random() * remainingMembers.length);
        chat.creator = remainingMembers[randomIndex];
    }

    chat.members = remainingMembers;

    const user = await User.findById(req.user, "name");
    await chat.save();

    emitEvent(req, ALERT, chat.members, `${user.name} has left the group`);
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "You have left the group successfully",
    });
});

const sendAttachments = TryCatch(async (req, res, next) => {
    const { chatId } = req.body;
  
  
    const [chat,me] = await Promise.all([
        Chat.findById(chatId),
        User.findById(req.user,"name")
    ]);

    if (!chat) {
      return next(new ErrorHandler("Chat not found", 404));
    }

    const files = req.files || [];
    if (files.length < 1) {
      return next(new ErrorHandler("Please provide attachments", 400));
    }

    //Upload files to cloudinary (pseudo)
    const attachments = [];

    const messageForDB = {content:"",attachments,sender:me._id,
        chat:chatId};

    const messageForRealTime = {
        ...messageForDB,
        sender:{
            _id:me._id,
            name:me.name,
        },
    };
    
    const message = await Message.create(messageForDB);
  
    emitEvent(req, NEW_ATTACHMENT, chat.members, {
        message: messageForRealTime,
        chatId,
    });
    emitEvent(req, NEW_MESSAGE_ALERT, chat.members,{chatId});
  
    return res.status(200).json({
      success: true,
      message,
    });
});
  
const getMessages = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;

    const {page = 1} = req.query;
    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;
    if (!chatId) {
        return next(new ErrorHandler("Chat ID is required", 400));
    } 

    const [messages,totalMessageCount] = await Promise.all([
        Message.find({ chat: chatId })
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(resultPerPage)   
        .populate("sender", "name")
        .lean(),
        Message.countDocuments({ chat: chatId })
    ]);

    const totalPages = Math.ceil(totalMessageCount / resultPerPage) || 0;

    return res.status(200).json({
        success: true,
        messages:messages.reverse(),
        totalPages,
    });
});

const getChatDetails = TryCatch(async (req, res, next) => {
    if(req.query.populate === "true") {
        const chat = await Chat.findById(req.params.id)
        .populate("members", "name avatar")
        .lean();

        if(!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }

        chat.members = chat.members.map((_id,name,avatar) => {
            return {
                _id,
                name,
                avatar: avatar.url,
            };
        });

        return res.status(200).json({
            success: true,
            chat,
        });
    }
    else{
        const chat = await Chat.findById(req.params.id)
        
        if(!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }

        return res.status(200).json({
            success: true,
            chat,
        });
    }
})

const renameGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;
    const { name } = req.body;


    const chat = await Chat.findById(chatId);

    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }

    if (!chat.groupChat) {
        return next(new ErrorHandler("This is not a group chat", 400));
    }

    if (chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("Only creator can rename the group", 403));
    }

    chat.name = name;
    await chat.save();

    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
        success: true,
        message: "Group renamed successfully",
    });
});

const deleteGroup = TryCatch(async (req, res, next) => {
    const chatId = req.params.id;



    const chat = await Chat.findById(chatId);

    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }
    
    const members  = chat.members;
    if(chat.groupChat && chat.creator.toString() !== req.user.toString()) {
        return next(new ErrorHandler("Only creator can delete the group", 403));
    }

    if(!chat.groupChat && !chat.members.includes(req.user.toString())) {
        return next(new ErrorHandler("Only members can delete the chat", 403));
    }


    // Here we have to delete All Messages as well as attachments or files from cloudinary
    const messageWithAttachments = await Message.find({
         chat: chatId,
         attachments: { $exists: true, $ne: [] },
    });

    const public_ids = [];
    messageWithAttachments.forEach(({attachment}) => {
        attachment.forEach(({public_id}) => {
            public_ids.push(public_id);
        });
    });

    // Delete files from cloudinary (pseudo)
    await Promise.all([
        deleteFilesFromCloudinary(public_ids),
        chat.deleteOne(),
        Message.deleteMany({ chat: chatId }),
    ]);


    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
        success: true,
        message: "Chat deleted successfully",
    });
});



export  { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments, getChatDetails, renameGroup, deleteGroup, getMessages };