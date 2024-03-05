import Joi from 'joi';

export const UserSearchSchema = Joi.object({
    pageSize: Joi.number().min(1).required(),
    page: Joi.number().min(1).required()
}).required();

