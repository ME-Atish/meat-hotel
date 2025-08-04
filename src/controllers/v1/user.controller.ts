import { Request, Response } from "express";
import AuthenticationRequest from "../../utils/authReq.js";
import bcrypt from "bcrypt";

import userModel from "../../models/user.model.js";
import * as userValidator from "../../utils/validators/user.validator.js";
import { generateRefreshToken } from "../../utils/auth.js";

/**
 * Get all the users information
 *
 * @param {*} req
 * @param {*} res
 *
 * @return res
 */
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userModel.findAll({
      attributes: { exclude: ["password"] },
    });

    const usersData = users.forEach((user) => {
      return user.dataValues;
    });

    res.json(usersData);
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

/**
 * Ban users with id
 *
 * @param {*} req
 * @param {*} res
 *
 * @returns res
 */
export const banUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find user for ban
    const mainUser = await userModel.findOne({
      where: {
        id,
      },
    });
    if (!mainUser?.dataValues) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    // Ban user process
    const findUser = await userModel.findOne({
      where: {
        id: mainUser.dataValues.id,
      },
    });

    if (findUser?.dataValues) {
      findUser.dataValues.is_ban = 1;
      findUser.save();
    }

    res.status(200).json({ message: "The user baned successfully" });
    return;
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
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const findUser = await userModel.findOne({
      where: {
        id,
      },
    });

    if (!findUser?.dataValues) {
      res.status(403).json({ message: "User not found" });
      return;
    }

    findUser.destroy();

    res.status(200).json({ message: "User delete successfully" });
    return;
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
export const updateInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Cast request to typedReq for use costume Request
    const typedReq = req as AuthenticationRequest;

    // Validate data with Zod
    const validationResult = userValidator.register(req.body);

    if (!validationResult.success) {
      res.status(422).json({ error: validationResult.error.errors });
      return;
    }

    const { name, username, email, phone, password } = req.body;

    // Password hashing process
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate new refresh token
    const newRefreshToken = generateRefreshToken(email);

    // Find user for update information

    const findUser = await userModel.findOne({
      where: {
        id: typedReq.user.id,
      },
    });

    if (!findUser?.dataValues) {
      res.status(403).json({
        message: "User not found",
      });
    }

    // Update user's info
    if (findUser?.dataValues) {
      findUser.dataValues.name = name;
      findUser.dataValues.username = username;
      (findUser.dataValues.email = email), (findUser.dataValues.phone = phone);
      findUser.dataValues.password = hashedPassword;
      findUser.dataValues.role = typedReq.user.role;
      findUser.dataValues.refresh_token = newRefreshToken;

      findUser.save();
    }

    // Set refresh token in cookie
    res.cookie("refresh_token", newRefreshToken, { httpOnly: true });

    res.status(200).json({ message: "User updated successfully" });
    return;
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
export const changeRole = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.body;

    // Find user to change role

    const user = await userModel.findOne({
      where: {
        id,
      },
    });

    if (!user?.dataValues) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    // If user's role is admin, it change to user and on the contrary
    let newRole = user!.dataValues.role === "ADMIN" ? "USER" : "ADMIN";

    // Set new role in database

    if (user?.dataValues) {
      user.dataValues.role = newRole;
      user.save();
    }

    res.status(200).json({ message: "User's role changed successfully" });
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
