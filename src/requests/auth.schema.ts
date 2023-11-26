import Joi from 'joi';

export const SignUpSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().min(8).required()
});

export const SignInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});