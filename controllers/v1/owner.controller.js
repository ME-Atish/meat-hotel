const ownerModel = require("../../models/owner.model");
const isValidObjectId = require("../../utils/isValidObjectId");
const registerOwnerValidator = require("../../utils/validators/owner.register.validate");

exports.getAll = async (req, res) => {
  try {
    const owners = await ownerModel.find({}).populate("user", "-password");

    return res.status(200).json({ owners });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.register = async (req, res) => {
  try {
    const { error } = registerOwnerValidator(req.body);
    if (error) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: error.details });
    }
    const { city } = req.body;

    const owner = await ownerModel.create({ user: req.user._id, city });

    return res.status(201).json({ owner });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    const deletedOwner = await ownerModel.findByIdAndDelete({ _id: id });

    if (!deletedOwner) {
      return res.status(403).json({ message: "The owner not founds" });
    }

    return res.status(200).json({ message: "Owner deleted successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }
    const { error } = registerOwnerValidator(req.body);
    if (error) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: error.details });
    }

    const { city } = req.body;

    const updatedUser = await ownerModel.findByIdAndUpdate(
      { _id: id },
      { city }
    );

    if (!updatedUser) {
      return res.status(409).json({ message: "owner not found" });
    }

    return res
      .status(200)
      .json({ message: "The owner's information updated successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
