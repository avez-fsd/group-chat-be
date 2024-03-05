import Group from "./models/group.model"

export const createGroupDb = (values: any) => {
    return Group.create(values);
}

export const getGroupByGroupUniqueId = (groupUniqueId: string) => {
    return Group.findOne({
        where: {
            groupUniqueId
        }
    })
}