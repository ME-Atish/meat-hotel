const joi = require("joi");

const loginValidation = (data) => {
  const schema = joi
    .object({
      username: joi.string().min(5).max(25),
      email: joi.string().email(),
      password: joi.string().min(5).max(16),
      rememberMe: joi.number().valid(0, 1),
    })
    .or("username", "password")
    .with("username", "password")
    .with("email", "password");

  return schema.validate(data, { abortEarly: false });
};

module.exports = loginValidation;
