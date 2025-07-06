import { Request, Response } from "express";
import bcrypt from "bcrypt";

import userModel from "@/models/user.model";
import isValidObjectId from "@/utils/isValidObjectId";
import * as userValidator from "@/utils/validators/user.validator";
import { generateRefreshToken } from "~/src/utils/auth";
import { ValidatedRequest } from "~/src/types/validated-request";

/**
 * Get all the users information
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @return res
 */
export const getAll = async (_: Request, res: Response) => {
  const users = await userModel.find({}).select("-password");

  return res.json(users);
};

/**
 * Ban users with id
 *
 * @param {Request} req
 * @param {Response} res
 *
 * @returns res
 */
export const banUser = async (req: Request, res: Response) => {
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
 * @param {Request} req
 * @param {Response} res
 *
 * @returns res
 */
export const remove = async (req: Request, res: Response) => {
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
 * @param {ValidatedRequest} req
 * @param {Response} res
 *
 * @returns res
 */
export const updateInfo = async (req: ValidatedRequest, res: Response) => {
  try {
    const validationResult = userValidator.register(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ error: validationResult.error.message });
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
 * @param {ValidatedRequest} req
 * @param {Response} res
 *
 * @returns res
 */
export const changeRole = async (req: ValidatedRequest, res: Response) => {
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
