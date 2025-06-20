const joi = require("joi");

/**
 * Validating the data that client send in req.body for sign-up operations
 *
 * @param string data
 *
 * @return boolean
 *
 */

const registerValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(5).max(25),
    name: joi.string().min(3).max(25),
    email: joi.string().email(),
    phone: joi.string(),
    password: joi.string().min(5).max(16),
    repeat_password: joi.ref("password"),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = registerValidation;
