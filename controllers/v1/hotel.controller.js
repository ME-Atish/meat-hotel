const hotelModel = require("../../models/hotel.model");
const ownerModel = require("../../models/owner.model");
const createHotelValidator = require("../../utils/validators/hotel.create.validator");

exports.getAll = async (req, res) => {
  try {
    const hotels = await hotelModel.find({});
    return res.json(hotels);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.create = async (req, res) => {
  try {
    const { error } = createHotelValidator(req.body);
    if (error) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: error.details });
    }

    const { name, address, description, facilities, price, province, city } =
      req.body;

    const ownerExist = await ownerModel.findOne({ user: req.user._id });

    if (!ownerExist) {
      await ownerModel.create({ user: req.user._id });
    }

    const createHotel = await hotelModel.create({
      name,
      address,
      description,
      facilities,
      price,
      province,
      city,
      image: req.files,
      owner: req.user,
    });

    return res.status(201).json(createHotel);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
