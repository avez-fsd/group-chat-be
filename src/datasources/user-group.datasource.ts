import { IncludeThroughOptions } from "sequelize";
import Group from "./models/group.model";
import UserGroup from "./models/user-group.model";
import User from "./models/user.model";

export const addUserToGroup = (data:any) => {
    return UserGroup.findOrCreate({
        where: {...data}
    });
}

export const getUserGroups = (user: User) => {
    return User.findOne({
        where: {
            id: user.id
        },
        include: [
            {
                model: Group
            }
        ]
    })
}