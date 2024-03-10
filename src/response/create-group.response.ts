import Group from "@datasources/models/group.model";

export const createGroupResponse = (group: Group) => {
    return {
        name: group.name,
        groupUniqueId: group.groupUniqueId
    }
}