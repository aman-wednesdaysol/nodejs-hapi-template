import Joi from 'joi';
import {
  idOrUUIDAllowedSchema,
  stringAllowedSchema,
  oneOfAllowedScopes,
  grantTypeSchema,
} from '@utils/validationUtils';

const payloadSchema = Joi.object({
  resources: Joi.array().items({
    resource_id: idOrUUIDAllowedSchema,
    resource_type: stringAllowedSchema,
  }),
  scope: oneOfAllowedScopes,
  client_id: Joi.string().required(),
  client_secret: Joi.string().optional(),
  grant_type: grantTypeSchema,
});

export default payloadSchema;
