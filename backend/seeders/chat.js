import { faker, simpleFaker } from "@faker-js/faker";
import { Chat } from "../models/chat.Models.js";
import { User } from "../models/user.Models.js";
import { Message } from "../models/message.Models.js";



const createSingleChats = async (numChats) =>{
    try {
        const users = await User.find().select("_id");
        const chatsPromise = [];

        for (let i = 0; i < users.length; i++) {
            for(let j = i + 1; j < users.length; j++) {
               
                chatsPromise.push(
                    Chat.create({
                        name:faker.lorem.words(2),
                        members: [users[i]._id, users[j]._id],
                        creator: users[i]._id,
                    })
                );
            }
        }

        await Promise.all(chatsPromise);

        console.log(`${numChats} single chats created successfully`);
        process.exit(1);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const createGroupChats = async (chatsCount) => {
    try {
        const users = await User.find().select("_id");
        const chatsPromise = [];

        for (let i = 0; i < chatsCount; i++) {
            const groupSize = simpleFaker.number.int({ min: 3, max: users.length });
            const memberSet = new Set();

            // Ensure unique members
            while (memberSet.size < groupSize) {
                const randomIndex = Math.floor(Math.random() * users.length);
                memberSet.add(users[randomIndex]._id.toString()); // Store as string to avoid duplicates
            }

            const members = Array.from(memberSet);

            const chat = Chat.create({
                name: faker.lorem.word(),
                groupChat: true,
                members,
                creator: members[0], // First member as creator
            });

            chatsPromise.push(chat);
        }

        await Promise.all(chatsPromise);

        console.log(`${chatsCount} group chats created successfully`);
        process.exit(0); // success
    } catch (error) {
        console.error(error);
        process.exit(1); // failure
    }
};

const createMessage = async (numMessages) => {
    try {
        const users = await User.find().select("_id");
        const chats = await Chat.find().select("_id");

        const messagesPromise = [];

        for (let i = 0; i < numMessages; i++) {
            const randomUserIndex = Math.floor(Math.random() * users.length);
            const randomChatIndex = Math.floor(Math.random() * chats.length);

            messagesPromise.push(
                Message.create({
                    sender: users[randomUserIndex],
                    chat: chats[randomChatIndex],
                    content: faker.lorem.sentence(10),
                })
            );
        }

        await Promise.all(messagesPromise);

        console.log(`${numMessages} messages created successfully`);
        process.exit(1);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const createMessageInAChat = async (chatId ,numMessages) => {
    try {
        const users = await User.find().select("_id");
        const messagesPromise = [];

        for (let i = 0; i < numMessages; i++) {
            const randomUserIndex = Math.floor(Math.random() * users.length);

            messagesPromise.push(
                Message.create({
                    sender: users[randomUserIndex]._id,
                    chat: chatId,
                    content: faker.lorem.sentence(10),
                })
            );
        }

        await Promise.all(messagesPromise);

        console.log(`${numMessages} messages created successfully in chat ${chatId}`);
        process.exit(1);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export { createGroupChats, createMessage, createMessageInAChat, createSingleChats };
