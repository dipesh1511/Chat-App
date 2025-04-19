import { body, check, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";


const validateHandler = (req,res,next)=>{
    const errors = validationResult(req);

    const errorMessages = errors.array()
    .map((error)=>error.msg)
    .join(", ");

    if(errors.isEmpty()) return next();
    else next(new ErrorHandler(errorMessages,400));
}

const registerValidator = ()=>[
    body("name","Please Provide name").notEmpty(),
    body("username","Please Provide username").notEmpty(),
    body("bio","Please Provide bio").notEmpty(),
    body("password","Please Provide password").notEmpty(),
    check("avatar","Please provide avatar").notEmpty()
];

const loginValidator = ()=>[
    body("username","Please Provide username").notEmpty(),
    body("password","Please Provide password").notEmpty()
];


const newGroupValidator = ()=>[
    body("name","Please Provide name").notEmpty(),
    body("members").notEmpty().withMessage("Please Provide members").isArray({min:2,max:100}).withMessage("Members must be between 2 and 100")
];


const addMemberValidator = ()=>[
    body("chatId","Please Provide chat ID").notEmpty(),
    body("members").notEmpty().withMessage("Please Provide members").isArray({min:1,max:97}).withMessage("Members must be between 1 and 97")
];



const removeMemberValidator = ()=>[
    body("chatId","Please Provide chat ID").notEmpty(),
    body("userId","Please Provide user ID").notEmpty(),
];




const sendAttachmentValidator = ()=>[
    body("chatId","Please Provide chat ID").notEmpty(),
    check("files")
    .notEmpty().withMessage("Please Upload Attachments")
    .isArray({min:1,max:5})
    .withMessage("Attachments must be between 1 and 5")
];

// this if for leavegroup validator, getmessage validator getchatdetails validator and deleteGroup validator
const chatIdValidator = ()=>[
    param("id","Please Provide chat ID").notEmpty(),
];


const renameGroupValidator = ()=>[
    param("id","Please Provide chat ID").notEmpty(),
    body("name","Please Provide name").notEmpty()
];


const sendFriendRequestValidator = ()=>[
    body("userId","Please Enter user ID").notEmpty(),
];

const acceptFriendRequestValidator = ()=>[
    body("requestId","Please Enter request ID").notEmpty(),
    body("accept").notEmpty().withMessage("Please Add Accept")
    .isBoolean().withMessage("Accept must be a boolean"),
];

export {
    addMemberValidator, chatIdValidator, loginValidator,
    newGroupValidator, registerValidator, removeMemberValidator, renameGroupValidator, sendAttachmentValidator, validateHandler,
    acceptFriendRequestValidator, sendFriendRequestValidator
};
