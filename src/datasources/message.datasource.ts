import { StoreMessageDTO } from "@interfaces/chat.interface";
import Message from "./models/message.model";
import User from "./models/user.model";


export const storeMessageDb = (data:StoreMessageDTO) => {
   return Message.create({
        ...data
   });
}

export const getMessagesByGroupId = (groupId: number) => {
   return Message.findAll({
      where: {
         groupId
      },
      include: {
         model: User
      }
   })
}