const joi = require("joi");

const updateInfoValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(5).max(25),
    name: joi.string().min(3).max(25),
    email: joi.string().email(),
    phone: joi.string(),
    password: joi.string().min(5).max(16),
    repeat_password: joi.ref("password"),
  });

  return schema.validate(data, { abortEarly: true });
};

module.exports = updateInfoValidation;
