
import mongoose from "mongoose"
    
const { model, models, Schema, Types } = mongoose;

const schema = new Schema({
    name:{
        type:String,
        required: true,
    },
    groupChat:{
        type:Boolean,
        default: false,
    },
    creator:{
        type:Types.ObjectId,
        ref:"User",
        required: true,
    },
    members:[{
        type:Types.ObjectId,
        ref:"User",
    }]
},{timestamps:true})

export const Chat = models.Chat || model("Chat",schema);