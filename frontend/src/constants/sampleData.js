

export const sampleChats = [{
    avatar:["https://www.w3schools.com/howto/img_avatar.png"],
    name:"John Doe",
    _id:"1",
    groupChat:false,
    members:["1","2"],
},
{
    avatar:["https://www.w3schools.com/howto/img_avatar.png"],
    name:"Dipesh dodke",
    _id:"2",
    groupChat:false,
    members:["1","2"],
},
];

export const sampleUsers = [
    {   avatar:["https://www.w3schools.com/howto/img_avatar.png"],
        name:"John Doe",
        _id:"1",
    },
    {
        avatar:["https://www.w3schools.com/howto/img_avatar.png"],
        name:"Dipesh dodke",
        _id:"2",
    }
];

export const sampleNotifications = [
    {   
    sender:{
        name:"John Doe",
        _id:"1",
    }
        
    },
    {
    sender:{
        name:"Dipesh dodke",
        _id:"2",
    }
       
    }
]

export const sampleMessage = [
    {
        attachments:[
            {
                public_id:"abcde",
                url:"https://www.w3schools.com/howto/img_avatar.com",
            },
        ],
        content:"ham ky hi msg hai",
        _id:"ajgfgfdsvfsd",
        sender:{
            _id:"user._id",
            name:"chaman",
        },
        chat:"chatId",
        createdAt:"2025-04-09T10:41:30.630Z",
    }
]