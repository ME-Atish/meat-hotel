import { Request, Response } from "express";
import AuthenticationRequest from "../../utils/authReq.js";
import bcrypt from "bcrypt";

import userModel from "../../models/user.model.js";
import isValidObjectId from "../../utils/isValidObjectId.js";
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
  const users = await userModel.find({}).select("-password");

  res.json(users);
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
    // Validate id
    if (isValidObjectId(id)) {
      res.status(422).json({ message: "The id not valid" });
    }

    // Find user for ban
    const mainUser = await userModel.findOne({ _id: id }).lean();
    if (!mainUser) {
      res.status(403).json({ message: "User not found" });
    }
    // Ban user process
    await userModel.findByIdAndUpdate({ _id: mainUser!._id }, { isBan: true });

    res.status(200).json({ message: "The user baned successfully" });
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
    // Validate id
    if (isValidObjectId(id)) {
      res.status(422).json({ message: "Id is not valid" });
    }

    const removeUser = await userModel.findByIdAndDelete({ _id: id });

    if (!removeUser) {
      res.status(403).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User delete successfully" });
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
  req: AuthenticationRequest,
  res: Response
): Promise<void> => {
  try {
    const validationResult = userValidator.register(req.body);

    if (!validationResult.success) {
      res.status(422).json({ error: validationResult.error.errors });
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

    res.status(200).json({ updateUser });
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
    // Validate id
    if (isValidObjectId(id)) {
      res.status(422).json({ message: "Id is not valid" });
    }
    // Find user to change role
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      res.status(403).json({ message: "User not found" });
    }
    // If user's role is admin, it change to user and on the contrary
    let newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    // Set new role in database
    await userModel.findByIdAndUpdate({ _id: id }, { role: newRole });

    res.status(200).json({ message: "User's role changed successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
