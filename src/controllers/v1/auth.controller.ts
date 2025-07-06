import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import userModel from "../../models/user.model.js";
import walletModel from "../../models/wallet.model.js";
import * as userValidator from "../../utils/validators/user.validator.js";
import { generateAccessToken } from "../../utils/auth.js";
import { generateRefreshToken } from "../../utils/auth.js";

/**
 * Register the users into website
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate req.body
    const validationResult = userValidator.register(req.body);

    if (!validationResult.success) {
      res.status(422).json({ error: validationResult.error.errors });
    }

    const { username, firstName, lastName, email, password, phone } = req.body;

    // Find user for check is the user ban or not
    const isUserBan = await userModel.findOne({ phone });

    if (isUserBan) {
      if (isUserBan.isBan) {
        res.status(409).json({ message: "This phone number is ban" });
      }
    }
    // Check is user exist (with username and email)
    const isUserExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      res.status(403).json({ message: "The username or email already exist" });
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

    // Create wallet for each user who register to project
    await walletModel.create({
      userId: user._id,
    });

    res.json(user);
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
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    interface RefreshTokenPayload extends jwt.JwtPayload {
      email: string;
    }

    // If the user's tick the remember me these codes for next time will work
    if (req.cookies.refresh_token) {
      const jwtPayload = jwt.verify(
        req.cookies.refresh_token,
        process.env.REFRESH_TOKEN_SECRET!
      ) as RefreshTokenPayload;
      // Find user
      const user = await userModel.findOne({ email: jwtPayload.email });

      if (!user) {
        res.status(403).json({ message: "User not found" });
      }
      res.json({ message: "Login successfully" });
    }

    const validationResult = userValidator.login(req.body);

    if (!validationResult.success) {
      res.status(422).json({ error: validationResult.error.errors });
    }

    // Identifier include username or email (either is one)
    const { identifier, password, rememberMe } = req.body;

    // Check for find username or email in database
    const user = await userModel.findOne({
      $or: [{ username: identifier }],
    });

    if (!user) {
      res.status(403).json({ message: "The username or email not found" });
    }
    // Checking for pass word correction
    const isPasswordCorrect = await bcrypt.compare(
      password.toString(),
      user!.password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "The password is not correct" });
    }
    // Generate access token
    const accessToken = generateAccessToken(user!.email);

    const email = user!.email;

    // Find user for get user's refresh token
    const findUser = await userModel.findOne({ email });
    // Get user's refresh token
    const refreshToken = findUser!.refreshToken;

    // Generate access token
    res.cookie("access_token", accessToken, { httpOnly: true });

    // check if the remember me is ticked
    if (rememberMe) {
      // Refresh token will set in cookie
      res.cookie("refresh_token", refreshToken, { httpOnly: true });
    }

    res.json({ message: "Login successfully" });
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
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Check if refresh token is exist or not (in cookie)
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      res.status(401).json({ message: "The refresh token expired" });
    }
    // Find user with refresh token
    const user = await userModel.findOne({ refreshToken });

    if (!user) {
      res.status(403).json({ message: "User not found" });
    }
    // Verifying refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    // Generate new access token
    const newAccessToken = generateAccessToken(user!.email);
    // Set new access token in cookie
    res.cookie("access_token", newAccessToken);

    res.status(204).json({});
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
