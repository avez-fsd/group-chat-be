import Joi from 'joi';

export const CreateGroupSchema = Joi.object({
    name: Joi.string().required()
});
