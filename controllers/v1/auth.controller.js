const bcrypt = require("bcrypt");

const userModel = require("../../models/user.model");
const banUserModel = require("../../models/ban.user.model");
const registerValidation = require("../../utils/validators/user.register.validate");

exports.register = async (req, res) => {
  try {
    const validationResult = registerValidation(req.body);

    if (!validationResult) {
      return res.status(422).json(validationResult);
    }

    const { username, name, email, password, phone } = req.body;

    const isUserBan = await banUserModel.findOne({ phone });

    if (isUserBan) {
      return res.status(409).json({ message: "This phone number is ban" });
    }

    const isUserExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      return res
        .status(409)
        .json({ message: "The username or email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      name,
      email,
      password: hashedPassword,
      phone,
      role: "USER",
    });

    return res.json(user);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
