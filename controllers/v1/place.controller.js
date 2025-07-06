const placeModel = require("../../models/place.model");
const userModel = require("../../models/user.model");
const reserveModel = require("../../models/reserve.model");
const placeValidator = require("../../utils/validators/place.validator");
const isValidObjectId = require("../../utils/isValidObjectId");

exports.getAll = async (req, res) => {
  try {
    // find all places
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
    // check req.body with Zod
    const validationResult = placeValidator.create(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ errors: validationResult.error.errors });
    }

    const { name, address, description, facilities, price, province, city } =
      req.body;

    // Check if the user who created the place owns it.
    const ownerExist = await userModel.findOne({ email: req.user.email });

    // If the user who created the place is not the owner, its role will change to owner.
    if (!ownerExist.isOwner) {
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
    // Validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    // delete place
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
    // validate body with Zod

    const validationResult = placeValidator.create(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ error: validationResult.error.errors });
    }

    const { id } = req.params;
    // validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    const { name, address, description, facilities, price, province, city } =
      req.body;

    // update place's information
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
    // Validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    // Find place that client want to reserve
    const placeInfo = await placeModel.findOne({ _id: id });

    // If place reserved these codes will run
    if (placeInfo.isReserved) {
      return res.status(409).json({ message: "Place already reserved" });
    }
    // Find user who want reserve a palace
    const userInfo = await userModel.findOne({ _id: req.user._id });
    // These codes will be executed if the user who submitted the request has reserved a place.
    if (userInfo.isReserved) {
      return res.status(409).json({ message: "User already reserved place" });
    }

    // Turn isReserved field in database to true (reservation operation completed)
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
    // Validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    // Cancel reservation operation
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
