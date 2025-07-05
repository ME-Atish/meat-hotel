const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../../models/user.model");
const banUserModel = require("../../models/ban.user.model");
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
        .status(403)
        .json({ message: "The username or email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const refreshToken = generateRefreshToken(email);

    const user = await userModel.create({
      username,
      name,
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
    // If the user's tick the remember me this codes for next time will work
    if (req.cookies.refresh_token) {
      const jwtPayload = jwt.verify(
        req.cookies.refresh_token,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await userModel.findOne(jwtPayload.email);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ message: "Login successfully" });
    }
    const { error } = loginValidation(req.body);
    if (error) {
      return res
        .status(422)
        .json({ message: "Validation failed", details: error.details });
    }

    const { identifier, password, rememberMe } = req.body;

    const user = await userModel.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    if (!user) {
      return res
        .status(403)
        .json({ message: "The username or email not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password.toString(),
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "The password is not correct" });
    }

    const accessToken = generateAccessToken(user.email);

    const email = user.email;

    const findUser = await userModel.findOne({ email });

    const refreshToken = findUser.refreshToken;

    console.log(findUser);
    console.log(refreshToken);

    res.cookie("access_token", accessToken, { httpOnly: true });

    // check if the remember me is ticked
    if (rememberMe) {
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
 * Client send request to this route and give access token in cookies
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "The refresh token expired" });
    }
    const user = await userModel.findOne({ refreshToken });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = generateAccessToken(user.email);

    res.cookie("access_token", newAccessToken);

    return res.status(204).json({});
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
