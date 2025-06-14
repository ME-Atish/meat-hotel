const userModel = require("../../models/user.model");
const banUserModel = require("../../models/ban.user.model");

exports.getAll = async (req, res) => {
  const users = await userModel.find({}).select("-password");

  return res.json(users);
};
