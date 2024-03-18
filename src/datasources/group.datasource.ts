import { Op } from "sequelize";
import Group from "./models/group.model"
import UserGroup from "./models/user-group.model";

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

export const isUserBelongsToGroup = (groupId:number, userId:number) => {
    return UserGroup.findOne({
        where: {
            userId,
            groupId
        }
    })
}

export const isPrivateGroupExists = async (userIds: number[]) => {
    const data = await Group.findOne({
        include: [{
          model: UserGroup,
          as:'userGroup1',
          where: {
            userId: userIds[0]
          }
        },
      {
        model: UserGroup,
        as:'userGroup2',
        where: {
          userId: userIds[1]
        }
      }],
        where: {
          isGroup: false
        }
      })
      if(data) return true;
      return false;
}