import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import userModel from "@/models/user.model";
import * as userValidator from "@/utils/validators/user.validator";
import { generateAccessToken, generateRefreshToken } from "@/utils/auth";
import { getRefreshTokenSecret } from "@/utils/tokens";

/**
 * Register the users into website
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns Register response
 */
export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = userValidator.register(req.body);
    if (!validationResult.success) {
      return res.status(422).json({ error: validationResult.error.message });
    }

    const { username, firstName, lastName, email, password, phone } = req.body;

    // Find user for check is the user ban or not
    const isUserBan = await userModel.findOne({ phone });

    if (isUserBan) {
      if (isUserBan.isBan) {
        return res.status(409).json({ message: "This phone number is ban" });
      }
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
 * @param {Request} req
 * @param {Response} res
 *
 * @returns response
 */
export const login = async (req: Request, res: Response) => {
  try {
    const refreshTokenSecret = getRefreshTokenSecret();

    // If the user's tick the remember me these codes for next time will work
    if (req.cookies.refresh_token) {
      const jwtPayload = jwt.verify(
        req.cookies.refresh_token,
        refreshTokenSecret
      );

      // Find user (TEST PLZ)
      const user = await userModel.findOne({ email: jwtPayload });

      if (!user) {
        return res.status(403).json({ message: "User not found" });
      }
      return res.json({ message: "Login successfully" });
    }

    const validationResult = userValidator.login(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ error: validationResult.error.message });
    }

    // Identifier include username or email (either is one)
    const { identifier, password, rememberMe } = req.body;

    // Check for find username or email in database
    const user = await userModel.findOne({
      $or: [{ username: identifier }],
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

    if (!findUser) {
      return res
        .status(404)
        .json({ message: "We couldn't find a user with this credentials!" });
    }

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
    throw error
  }
};

/**
 * Client send request to this route each 20s and give new access token in cookies
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns response
 */
export const refreshToken = async (req: Request, res: Response) => {
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

    const refreshTokenSecret = getRefreshTokenSecret();

    // Verifying refresh token
    jwt.verify(refreshToken, refreshTokenSecret);

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
