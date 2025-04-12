import { TryOutlined } from "@mui/icons-material";


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

export const dashboardData = {
    users:[
    {   avatar:["https://www.w3schools.com/howto/img_avatar.png"],
        name:"John Doe",
        _id:"1",
        username:"John123",
        friends:"20",
        groups:"4"
    },
    {
        avatar:["https://www.w3schools.com/howto/img_avatar.png"],
        name:"Dipesh dodke",
        _id:"2",
        username:"Dipesh1543",
        friends:"4",
        groups:"3"
    }
],

chats:[{
    name:"Jadu ki jhappi",
    avatar:["https://www.w3schools.com/howto/img_avatar.png"],
    _id:"1",
    groupChat:false,
    members:[
        {_id:"1",avatar:"https://www.w3schools.com/howto/img_avatar.png"},
        {_id:"2",avatar:"https://www.w3schools.com/howto/img_avatar.png"}],
    totalMembers:2,
    totalMessages:20,
    creator:{
        name:"Chomu",
        avatar:"https://www.w3schools.com/howto/img_avatar.png",
    }
},
{
    name:"Ghante Ka Group",
    avatar:["https://www.w3schools.com/howto/img_avatar.png"],
    _id:"2",
    groupChat:false,
    members:[{_id:"1",avatar:"https://www.w3schools.com/howto/img_avatar.png"},
        {_id:"2",avatar:"https://www.w3schools.com/howto/img_avatar.png"},
        {_id:"3",avatar:"https://www.w3schools.com/howto/img_avatar.png"}],
    totalMembers:5,
    totalMessages:30,
    creator:{
        name:"Dipesh",
        avatar:"https://www.w3schools.com/howto/img_avatar.png",
    }
}
],

messages:[
    {
        attachments:[],
        content:"Pillla sa message hai",
       _id:"adsvgdvbhds",
        sender:{
            avatar:"https://www.w3schools.com/howto/img_avatar.com",
            name:"Jhatu",
        },
        chat:"chatId",
        groupChat:false,
        createdAt:"2024-02-12T10:41:30.630Z",
    },
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
            avatar:"https://www.w3schools.com/howto/img_avatar.com",
            name:"chaman",
        },
        chat:"chatId",
        groupChat:TryOutlined,
        createdAt:"2025-04-09T10:41:30.630Z",
    }
]
}


