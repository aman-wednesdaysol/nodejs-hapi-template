import JoiBase from 'joi';
import JoiDate from '@hapi/joi-date';

const Joi = JoiBase.extend(JoiDate);

export const idAllowedSchema = Joi.number().min(1).required();

export const idOptionalSchema = Joi.number().min(1).optional();

export const tokenSchema = Joi.string();

export const dateOptionalSchema = Joi.date().iso().optional().raw();

export const urlSchema = Joi.string().uri();

export const metadataSchema = Joi.object();

export const stringSchema = Joi.string().required();

export const stringSchemaOptional = Joi.string().optional();

export const emailAllowedSchema = Joi.string().email({ tlds: { allow: true } });

export const emailSchema = Joi.string().email({ tlds: { allow: true } });

export const dateAllowedSchema = Joi.date();

export const numberSchema = Joi.number();

export const statusSchema = Joi.binary().length(2);

export const versionStatusSchema = Joi.number().integer().min(0).max(2);
export const idOrUUIDAllowedSchema = [Joi.string(), Joi.number()];
export const stringAllowedSchema = Joi.string().required();

export const numberAllowedSchema = Joi.number();
