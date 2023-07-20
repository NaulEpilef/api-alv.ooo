import joi from "joi";

const createTargetSchema = joi.object({
  title: joi.string()
    .max(300)
    .required(),
  isPrivate: joi.boolean()
    .strict()
    .required(),
});

const editTargetSchema = joi.object({
  targetId: joi.string()
    .max(300)
    .guid()
    .required(),
  title: joi.string()
    .max(300)
    .required(),
  isPrivate: joi.boolean()
    .strict()
    .required(),
});

export { createTargetSchema, editTargetSchema };