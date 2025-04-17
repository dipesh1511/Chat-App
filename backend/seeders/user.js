import { User } from "../models/user.Models.js";
import { faker } from "@faker-js/faker";

const createUser = async(numUsers) => {
    try {
        
        const usersPromise = [];
        for (let i = 0; i < numUsers; i++) {
            const tempUser = User.create({ 
                name: faker.name.fullName(),
                username: faker.internet.userName(),
                bio: faker.lorem.sentence(10),
                password: "password",
                avatar:{
                    public_id: faker.system.fileName(),
                    url: faker.image.avatar(),
                },
             });
            
            usersPromise.push(tempUser);
        }
        
    await Promise.all(usersPromise);

    console.log(`${numUsers} users created successfully`);
    process.exit(1)
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export {createUser}