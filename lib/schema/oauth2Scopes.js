import Joi from 'joi';
import {
  numberAllowedSchema,
  oneOfAllowedScopes,
  idAllowedSchema,
} from '@utils/validationUtils';

export const querySchema = Joi.object({
  page: numberAllowedSchema,
  limit: numberAllowedSchema,
});

export const payloadSchema = Joi.object({
  scope: oneOfAllowedScopes,
  oauth_client_id: idAllowedSchema,
});
