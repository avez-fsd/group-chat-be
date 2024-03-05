import Joi from 'joi';

export const socketMessageEventSchema = (eventSchema:Joi.AnySchema) => {
    return Joi.object({
        event: Joi.string().required(),
        data: eventSchema
    }).required();
}

