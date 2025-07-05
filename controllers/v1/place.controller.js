const placeModel = require("../../models/place.model");
const userModel = require("../../models/user.model");
const reserveModel = require("../../models/reserve.model");
const createPlaceValidator = require("../../utils/validators/place.create.validator");
const isValidObjectId = require("../../utils/isValidObjectId");

exports.getAll = async (req, res) => {
  try {
    const places = await placeModel.find({});
    return res.status(200).json(places);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.create = async (req, res) => {
  try {
    const { error } = createPlaceValidator(req.body);
    if (error) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: error.details });
    }

    const { name, address, description, facilities, price, province, city } =
      req.body;

    const ownerExist = await userModel.findOne({ email: req.user.email });

    console.log(ownerExist);

    if (!ownerExist.owner) {
      await userModel.findByIdAndUpdate(
        { _id: req.user._id },
        { isOwner: true }
      );
    }

    const createPlace = await placeModel.create({
      name,
      address,
      description,
      facilities,
      price,
      province,
      city,
      isReserved: false,
      image: req.files,
      owner: req.user,
    });

    return res.status(201).json(createPlace);
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

    const deletePlace = await placeModel.findByIdAndDelete({ _id: id });

    if (!deletePlace) {
      return res.status(403).json({ message: "The place not found" });
    }

    return res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.update = async (req, res) => {
  try {
    const { error } = createPlaceValidator(req.body);

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

    const updatePlace = await placeModel.findByIdAndUpdate(
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
    if (!updatePlace) {
      return res.status(403).json({ message: "Place not found" });
    }

    return res.status(200).json({ message: "Place updated successfully" });
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

    const placeInfo = await placeModel.findOne({ _id: id });

    if (placeInfo.isReserved) {
      return res.status(409).json({ message: "Place already reserved" });
    }

    const userInfo = await userModel.findOne({ _id: req.user._id });
    if (userInfo.isReserved) {
      return res.status(409).json({ message: "User already reserved place" });
    }

    await placeModel.findByIdAndUpdate(
      { _id: placeInfo._id },
      { isReserved: true }
    );
    await userModel.findByIdAndUpdate(
      { _id: userInfo._id },
      { isReserved: true }
    );

    await reserveModel.create({ place: placeInfo._id, user: req.user._id });

    return res.status(200).json({
      message: "Place reserved successfully",
    });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    await placeModel.findByIdAndUpdate(
      { _id: id },
      {
        isReserved: false,
      }
    );

    await userModel.findByIdAndUpdate(
      { _id: req.user._id },
      {
        isReserved: false,
      }
    );

    return res.status(200).json({
      message: "The reservation operation was successfully canceled.",
    });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
