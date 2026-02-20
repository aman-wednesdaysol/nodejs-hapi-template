import Joi from 'joi';
import { stringAllowedSchema } from '@utils/validationUtils';

const querySchema = Joi.object({
  repo: stringAllowedSchema,
});

export default querySchema;
