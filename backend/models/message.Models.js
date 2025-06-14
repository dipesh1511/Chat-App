
import mongoose from "mongoose"
    
const { model, models, Schema, Types } = mongoose;

const schema = new Schema({
    name:{
        type:String,
    },
    content:{
        type:String,
    },
    attachments:[{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    }],
    sender:{
        type:Types.ObjectId,
        ref:"User",
        required: true,
    },
    chat:{
        type:Types.ObjectId,
        ref:"Chat",
        required: true,
    }
},{timestamps:true})

export const Message = models.Message || model("Message",schema);