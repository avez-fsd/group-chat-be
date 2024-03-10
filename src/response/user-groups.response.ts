import Group from "@datasources/models/group.model";
import User from "@datasources/models/user.model";


export const userGroupsResponse = (user: User) => {
    return {
        name: user.name,
        email: user.email,
        groups: user.groups?.map((group: Group)=>{
            return {
                name: group.name,
                groupUniqueId: group.groupUniqueId,
                isGroup: group.isGroup,
                isAdmin: group.createdBy === user.id,
                otherParticipants: group?.otherParticipants?.map(user=> {
                    return {
                        name: user.name,
                        email: user.email,
                        userUniqueId: user.userUniqueId
                    }
                })
            }
        }
        )
    }
}