import Joi from 'joi';
import {
  idAllowedSchema,
  numberAllowedSchema,
  idOrUUIDAllowedSchema,
  stringAllowedSchema,
} from '@utils/validationUtils';

export const querySchema = Joi.object({
  page: numberAllowedSchema,
  limit: numberAllowedSchema,
});

export const payloadSchema = Joi.object({
  oauth_client_id: idAllowedSchema,
  resource_id: idOrUUIDAllowedSchema,
  resource_type: stringAllowedSchema,
});
