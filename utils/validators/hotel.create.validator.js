const joi = require("joi");

const createHotelValidator = async (data) => {
  const schema = joi.object({
    name: joi.string().min(2).max(20),
    address: joi.string().min(8).max(80),
    description: joi.string().min(8).max(50),
    facilities: joi.string().max(20),
    price: joi.number(),
    isReserved: joi.number().valid(0, 1),
    province: joi.string().min(2).max(20),
    city: joi.string().min(2).max(20),
    image: joi.string(),
  });
  return schema.validate(data, { abortEarly: true });
};

module.exports = createHotelValidator;
