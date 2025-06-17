const joi = require("joi");

/**
 * Validating the data that client send in req.body for login operations
 *
 * @param string data
 *
 * @return boolean
 *
 */
const loginValidation = (data) => {
  const schema = joi.object({
    identifier: joi
      .alternatives()
      .try(joi.string().email(), joi.string().min(5).max(25))
      .required(),
    password: joi.string().min(5).max(16).required(),
    rememberMe: joi.number().valid(0, 1),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = loginValidation;
