const mongoose = require("mongoose");

const userModel = require("../../models/user.model");
const banUserModel = require("../../models/ban.user.model");
const isValidObjectId = require("../../utils/isValidObjectId")

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
