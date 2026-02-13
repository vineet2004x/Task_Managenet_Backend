
const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

const schemas = {
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        otp: Joi.string().length(6).required()
    }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    requestOtp: Joi.object({
        email: Joi.string().email().required()
    }),
    createTask: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow('', null),
        status: Joi.string().valid('pending', 'in-progress', 'completed')
    }),
    updateTask: Joi.object({
        title: Joi.string(),
        description: Joi.string().allow('', null),
        status: Joi.string().valid('pending', 'in-progress', 'completed')
    })
};

module.exports = { validate, schemas };
