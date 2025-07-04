const hotelModel = require("../../models/hotel.model");
const ownerModel = require("../../models/owner.model");
const userModel = require("../../models/user.model");
const reserveModel = require("../../models/reserve.model");
const createHotelValidator = require("../../utils/validators/hotel.create.validator");
const isValidObjectId = require("../../utils/isValidObjectId");

exports.getAll = async (req, res) => {
  try {
    const hotels = await hotelModel.find({});
    return res.status(200).json(hotels);
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

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    const deleteHotel = await hotelModel.findByIdAndDelete({ _id: id });

    if (!deleteHotel) {
      return res.status(403).json({ message: "The hotel not found" });
    }

    return res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.update = async (req, res) => {
  try {
    const { error } = createHotelValidator(req.body);

    if (error) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: error.details });
    }
    const { id } = req.params;
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    const { name, address, description, facilities, price, province, city } =
      req.body;

    const updateHotel = await hotelModel.findByIdAndUpdate(
      { _id: id },
      {
        name,
        address,
        description,
        facilities,
        price,
        province,
        city,
        image: req.files,
        owner: req.user._id,
      }
    );
    if (!updateHotel) {
      return res.status(403).json({ message: "Hotel not found" });
    }

    return res.status(200).json({ message: "Hotel updated successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.reserve = async (req, res) => {
  try {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    const hotelInfo = await hotelModel.findOne({ _id: id });

    if (hotelInfo.isReserved) {
      return res.status(409).json({ message: "Hotel already reserved" });
    }

    const userInfo = await userModel.findOne({ _id: req.user._id });
    if (userInfo.isReserved) {
      return res.status(409).json({ message: "User already reserved hotel" });
    }

    await hotelModel.findByIdAndUpdate(
      { _id: hotelInfo._id },
      { isReserved: 1 }
    );
    await userModel.findByIdAndUpdate({ _id: userInfo._id }, { isReserved: 1 });

    await reserveModel.create({ hotel: hotelInfo._id, user: req.user._id });

    return res.status(200).json({
      message: "Hotel reserved successfully",
    });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
