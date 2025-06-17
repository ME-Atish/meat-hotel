const bcrypt = require("bcrypt");

const userModel = require("../../models/user.model");
const banUserModel = require("../../models/ban.user.model");
const isValidObjectId = require("../../utils/isValidObjectId");
const updateInfoValidator = require("../../utils/validators/user.update.validate");

exports.getAll = async (req, res) => {
  const users = await userModel.find({}).select("-password");

  return res.json(users);
};

exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (isValidObjectId(id)) {
      return res.status(409).json({ message: "The id not valid" });
    }

    const mainUser = await userModel.findOne({ _id: id }).lean();
    if (!mainUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const banUserResult = await banUserModel.create({ phone: mainUser.phone });

    return res.status(200).json({ message: "The user baned successfully" });
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
      return res.status(409).json({ message: "Id is not valid" });
    }

    const removeUser = await userModel.findByIdAndDelete({ _id: id });

    if (!removeUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User delete successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.updateInfo = async (req, res) => {
  try {
    const { error } = updateInfoValidator(req.body);
    if (error) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: error.details });
    }

    const { name, username, email, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUser = await userModel
      .findByIdAndUpdate(
        { _id: req.user._id },
        {
          name,
          username,
          email,
          phone,
          password: hashedPassword,
          role: req.user.role,
        }
      )
      .select("-password");

    return res.status(200).json({ updateUser });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
