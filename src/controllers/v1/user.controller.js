const bcrypt = require("bcrypt");

const userModel = require("../../models/user.model");
const isValidObjectId = require("../../utils/isValidObjectId");
const userValidator = require("../../utils/validators/user.validator");
const { generateRefreshToken } = require("../../utils/auth");

/**
 * Get all the users information
 *
 * @param {*} req
 * @param {*} res
 *
 * @return res
 */
exports.getAll = async (req, res) => {
  const users = await userModel.find({}).select("-password");

  return res.json(users);
};

/**
 * Ban users with id
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "The id not valid" });
    }

    // Find user for ban
    const mainUser = await userModel.findOne({ _id: id }).lean();
    if (!mainUser) {
      return res.status(403).json({ message: "User not found" });
    }
    // Ban user process
    await userModel.findByIdAndUpdate({ _id: mainUser._id }, { isBan: true });

    return res.status(200).json({ message: "The user baned successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

/**
 * Remove the users from website
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    const removeUser = await userModel.findByIdAndDelete({ _id: id });

    if (!removeUser) {
      return res.status(403).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User delete successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

/**
 * Updating the user information
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
exports.updateInfo = async (req, res) => {
  try {
    const validationResult = userValidator.register(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ error: validationResult.error.errors });
    }

    const { name, username, email, phone, password } = req.body;

    // Password hashing process
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate new refresh token
    const newRefreshToken = generateRefreshToken(email);

    // Update user's info
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
          refreshToken: newRefreshToken,
        }
      )
      .select("-password");

    // Set refresh token in cookie
    res.cookie("refresh_token", newRefreshToken, { httpOnly: true });

    return res.status(200).json({ updateUser });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

/**
 * Change uses's role
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
exports.changeRole = async (req, res) => {
  try {
    const { id } = req.body;
    // Validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }
    // Find user to change role
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    // If user's role is admin, it change to user and on the contrary
    let newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    // Set new role in database
    await userModel.findByIdAndUpdate({ _id: id }, { role: newRole });

    return res
      .status(200)
      .json({ message: "User's role changed successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
