import Joi from 'joi';

export const likePayloadSchema = Joi.object({
  trackId: Joi.number().integer().positive().required(),
  trackName: Joi.string().min(1).required(),
  artistName: Joi.string().min(1).required(),
  albumName: Joi.string().min(1).required(),
  previewUrl: Joi.string().uri().allow(null, '').optional(),
  artworkUrl: Joi.string().uri().allow(null, '').optional(),
}).options({ stripUnknown: true });

export const unlikeParamsSchema = Joi.object({
  trackId: Joi.number().integer().positive().required(),
});
