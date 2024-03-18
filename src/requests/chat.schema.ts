import Joi from 'joi';

export const MessageReceivedEventSchema = Joi.object({
    message: Joi.string().required(),
    createdAt: Joi.string().required(),
    updatedAt: Joi.string().required(),
    user: {
      name: Joi.string().required(),
      email: Joi.string().required(),
      userUniqueId: Joi.string().required(),
    }
}).required();

