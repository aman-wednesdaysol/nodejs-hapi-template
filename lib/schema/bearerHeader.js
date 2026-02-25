import Joi from "joi";


const BEARER = Joi.object({
  authorization: Joi.string().pattern(/^Bearer\s+\S+$/i).required(),
}).unknown();

export default BEARER;