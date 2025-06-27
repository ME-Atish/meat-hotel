const joi = require("joi");

/**
 * Validating the data that client send in req.body for update their information
 *
 * @param string data
 *
 * @return boolean
 *
 */

const updateInfoValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(5).max(25),
    name: joi.string().min(3).max(25),
    email: joi.string().email(),
    phone: joi.string(),
    isReserved: joi.number().valid(0, 1),
    password: joi.string().min(5).max(16),
    repeat_password: joi.ref("password"),
  });

  return schema.validate(data, { abortEarly: true });
};

module.exports = updateInfoValidation;
