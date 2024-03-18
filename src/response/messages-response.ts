import Message from "@datasources/models/message.model"

export const groupMessagesResponse = (messages: Message[]) => {
    return {
        messages: messages.map((message)=>{
            return messageResponse(message)
        })
    }
}

export const messageResponse = (message: Message) => {
    return {
        message: message.message,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        user: {
            name: message.user?.name,
            email: message.user?.email,
            userUniqueId: message.user?.userUniqueId
        }
    }
}