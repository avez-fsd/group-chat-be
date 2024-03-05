import Joi from 'joi';

export const MessageReceivedEventSchema = Joi.object({
    message: Joi.string().required()
}).required();

