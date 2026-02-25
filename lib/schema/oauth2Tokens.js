import Joi from 'joi';
import {
  clientCredentialsSchema,
  grantTypeSchema,
} from '@utils/validationUtils';

const payloadSchema = Joi.object({
  grant_type: grantTypeSchema,
  client_id: clientCredentialsSchema,
  client_secret: clientCredentialsSchema.optional(),
  id_token: Joi.string().optional(),
}).options({
  stripUnknown: true,
});

export default payloadSchema;
