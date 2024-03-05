import Joi from 'joi';

export const CreateGroupSchema = Joi.object({
    name: Joi.string().required()
});


export const JoinGroupSchema = Joi.object({
    groupUniqueId: Joi.string().required()
});
