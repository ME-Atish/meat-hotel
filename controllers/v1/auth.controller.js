const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../../models/user.model");
const registerValidation = require("../../utils/validators/user.register.validate");
const loginValidation = require("../../utils/validators/user.login.validate");
const { generateAccessToken } = require("../../utils/auth");
const { generateRefreshToken } = require("../../utils/auth");

/**
 * Register the users into website
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
exports.register = async (req, res) => {
  try {
    const validationResult = registerValidation(req.body);
    // Validate req.body
    if (!validationResult) {
      return res.status(422).json(validationResult);
    }

    const { username, firstName, lastName, email, password, phone } = req.body;

    // Find user for check is the user ban or not
    const isUserBan = await userModel.findOne({ phone });

    if (isUserBan.isBan) {
      return res.status(409).json({ message: "This phone number is ban" });
    }
    // Check is user exist (with username and email)
    const isUserExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      return res
        .status(403)
        .json({ message: "The username or email already exist" });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Generate refresh token
    const refreshToken = generateRefreshToken(email);

    const user = await userModel.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: "USER",
      isReserved: 0,
      refreshToken,
    });

    return res.json(user);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

/**
 * Login to the website into website
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
exports.login = async (req, res) => {
  try {
    // If the user's tick the remember me these codes for next time will work
    if (req.cookies.refresh_token) {
      const jwtPayload = jwt.verify(
        req.cookies.refresh_token,
        process.env.REFRESH_TOKEN_SECRET
      );
      // Find user
      const user = await userModel.findOne(jwtPayload.email);

      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }
      return res.json({ message: "Login successfully" });
    }
    const { error } = loginValidation(req.body);
    // Validate req.body
    if (error) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: error.details });
    }

    // Identifier include username or email (either is one)
    const { identifier, password, rememberMe } = req.body;

    // Check for find username or email in database
    const user = await userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "The username or email not found" });
    }
    // Checking for pass word correction 
    const isPasswordCorrect = await bcrypt.compare(
      password.toString(),
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "The password is not correct" });
    }
    // Generate access token
    const accessToken = generateAccessToken(user.email);

    const email = user.email;

    // Find user for get user's refresh token
    const findUser = await userModel.findOne({ email });
    // Get user's refresh token
    const refreshToken = findUser.refreshToken;

    // Generate access token
    res.cookie("access_token", accessToken, { httpOnly: true });

    // check if the remember me is ticked
    if (rememberMe) {
      // Refresh token will set in cookie
      res.cookie("refresh_token", refreshToken, { httpOnly: true });
    }

    return res.json({ message: "Login successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

/**
 * Client send request to this route each 20s and give new access token in cookies
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
exports.refreshToken = async (req, res) => {
  try {
    // Check if refresh token is exist or not (in cookie)
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "The refresh token expired" });
    }
    // Find user with refresh token
    const user = await userModel.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    // Verifying refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Generate new access token
    const newAccessToken = generateAccessToken(user.email);
    // Set new access token in cookie
    res.cookie("access_token", newAccessToken);

    return res.status(204).json({});
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
