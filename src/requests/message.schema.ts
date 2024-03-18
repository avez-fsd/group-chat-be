import Joi from "joi";

export const MessageListRequestSchema = Joi.object({
    groupUniqueId: Joi.string().required()
}).required();

export const CreateMessageRequestSchema = Joi.object({
    groupUniqueId: Joi.string().required(),
    message: Joi.string().required()
}).required();

