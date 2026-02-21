import Joi from 'joi';

export const querySchema = Joi.object({
  term: Joi.string().min(1).required(),
  limit: Joi.number().integer().min(1).max(200).default(25),
  offset: Joi.number().integer().min(0).default(0),
  country: Joi.string().default('US'),
});

export const trackIdParamsSchema = Joi.object({
  trackId: Joi.number().integer().positive().required(),
});
