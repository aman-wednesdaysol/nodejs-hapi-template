import Joi from 'joi';


const payloadSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: true } }).required(),
  password: Joi.string().min(6).required(),
}).options({ stripUnknown: true });

export default payloadSchema;