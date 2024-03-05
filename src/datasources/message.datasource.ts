import { StoreMessageDTO } from "@interfaces/chat.interface";
import Message from "./models/message.model";


export const storeMessage = (data:StoreMessageDTO) => {
   return Message.create({
        ...data
   });
}