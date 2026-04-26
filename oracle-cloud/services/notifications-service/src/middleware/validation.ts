import Joi from 'joi';

export const emailSchema = Joi.object({
  to: Joi.alternatives().try(
    Joi.string().email(),
    Joi.array().items(Joi.string().email())
  ).required(),
  subject: Joi.string().required(),
  text: Joi.string(),
  html: Joi.string(),
  template: Joi.string(),
  context: Joi.object(),
  attachments: Joi.array().items(
    Joi.object({
      filename: Joi.string().required(),
      path: Joi.string(),
      content: Joi.alternatives().try(Joi.binary(), Joi.string()),
    })
  ),
}).or('text', 'html', 'template');

export const smsSchema = Joi.object({
  to: Joi.string().required(),
  body: Joi.string().required().max(1600),
  mediaUrl: Joi.array().items(Joi.string().uri()),
});

export const pushSchema = Joi.object({
  token: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string())
  ).required(),
  title: Joi.string().required(),
  body: Joi.string().required(),
  data: Joi.object().pattern(Joi.string(), Joi.string()),
  imageUrl: Joi.string().uri(),
  icon: Joi.string(),
  clickAction: Joi.string().uri(),
});

export const bulkEmailSchema = Joi.object({
  emails: Joi.array().items(emailSchema).required().min(1).max(100),
});

export const bulkSmsSchema = Joi.object({
  messages: Joi.array().items(smsSchema).required().min(1).max(100),
});
