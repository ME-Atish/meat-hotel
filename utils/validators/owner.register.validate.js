const joi = require("joi");

/**
 * Validating the data that client send in req.body for sign-up ow operations
 *
 * @param string data
 *
 * @return boolean
 *
 */

const registerValidation = (data) => {
  const schema = joi.object({
    city: joi.string(),
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = registerValidation;
