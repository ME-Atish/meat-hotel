import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { Op } from "sequelize";

import userModel from "../../models/user.model.js";
import walletModel from "../../models/wallet.model.js";
import * as userValidator from "../../utils/validators/user.validator.js";
import { generateAccessToken } from "../../utils/auth.js";
import { generateRefreshToken } from "../../utils/auth.js";
import { generateRememberMeToken } from "../../utils/auth.js";

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
      return;
    }

    const { username, firstName, lastName, email, password, phone } = req.body;

    // Find user for check is the user ban or not
    const isUserBan = await userModel.findOne({
      where: {
        phone,
      },
    });

    if (isUserBan?.dataValues) {
      if (isUserBan.dataValues.isBan) {
        res.status(409).json({ message: "This phone number is ban" });
        return;
      }
    }

    const isUserExist = await userModel.findOne({
      where: {
        [Op.or]: {
          username,
          email,
        },
      },
    });

    if (isUserExist?.dataValues) {
      res.status(403).json({ message: "The username or email already exist" });
      return;
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
      isReserved: false,
      refreshToken,
    });

    // Create wallet for each user who register to project
    await walletModel.create({
      userId: user.dataValues.id,
    });

    res.status(201).json(user);
    return;
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
    interface rememberMePayload extends jwt.JwtPayload {
      email: string;
    }

    // If the user's tick the remember me these codes for next time will work
    if (req.cookies.rememberMe_token) {
      const jwtPayload = jwt.verify(
        req.cookies.rememberMe_token,
        process.env.REMEMBER_ME_TOKEN_SECRET!
      ) as rememberMePayload;
      // Find user
      const user = await userModel.findOne({
        where: {
          email: jwtPayload.email,
        },
      });

      if (!user?.dataValues) {
        res
          .status(403)
          .json({ message: "User not found. Delete cookies to continue" });
        return;
      }
      res.json({ message: "Login successfully" });
      return;
    }

    const validationResult = userValidator.login(req.body);

    if (!validationResult.success) {
      res.status(422).json({ error: validationResult.error.errors });
      return;
    }

    // Identifier include username or email (either is one)
    const { identifier, password, rememberMe } = req.body;

    // Check for find username or email in database
    const user = await userModel.findOne({
      where: {
        [Op.or]: {
          username: identifier,
          email: identifier,
        },
      },
    });

    if (!user) {
      res.status(403).json({ message: "The username or email not found" });
      return;
    }
    // Checking for pass word correction
    const isPasswordCorrect = await bcrypt.compare(
      password.toString(),
      user!.dataValues.password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "The password is not correct" });
      return;
    }
    // Generate access token
    const accessToken = generateAccessToken(user!.dataValues.email);

    const email = user!.dataValues.email;

    // Find user for get user's refresh token
    const findUser = await userModel.findOne({
      where: {
        email,
      },
    });
    // Get user's refresh token
    const refreshToken = findUser!.dataValues.refreshToken;

    // Set access token in cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Set refresh token in cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    // check if the remember me is ticked
    if (rememberMe) {
      const rememberMeToken = generateRememberMeToken(email);
      res.cookie("rememberMe_token", rememberMeToken, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      });
    }

    res.json({ message: "Login successfully" });
    return;
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
      return;
    }
    // Find user with refresh token
    const user = await userModel.findOne({
      where: {
        refreshToken,
      },
    });

    if (!user?.dataValues) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    // Verifying refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    // Generate new access token
    const newAccessToken = generateAccessToken(user!.dataValues.email);
    // Set new access token in cookie
    res.cookie("access_token", newAccessToken);

    res.status(204).json({});
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
