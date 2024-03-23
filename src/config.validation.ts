import * as Joi from '@hapi/joi';

export const configValidation = Joi.object({
  MONGO_URI: Joi.string().required(),
});
