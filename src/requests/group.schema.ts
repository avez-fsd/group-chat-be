import Joi from 'joi';

export const CreateGroupSchema = Joi.object({
    name: Joi.string().required().allow(""),
    isGroup: Joi.boolean().required(),
    users: Joi.array().when('isGroup', {
      is: true,
      then: Joi.array().items(Joi.string()).min(2).required().messages({'array.min': 'Users must be atlest 2 for a group'}),
      otherwise: Joi.array().items(Joi.string()).min(1).max(1).required().messages({'array.min': 'Min 1 user for a private chat',
      'array.max':'Max 1 user is allowed for a private chat'}),
    })
});


export const JoinGroupSchema = Joi.object({
    groupUniqueId: Joi.string().required()
});
