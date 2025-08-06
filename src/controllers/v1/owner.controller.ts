import { Request, Response, text } from "express";

import userModel from "../../models/user.model.js";
import AuthenticationRequest from "../../utils/authReq";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const owners = await userModel.findAll({
      where: {
        isOwner: 1,
      },
      raw: true,
    });

    res.status(200).json(owners);
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const owner = await userModel.findOne({
      where: {
        id,
        isOwner: 1,
      },
      raw: true,
    });

    if (!owner) {
      res.status(403).json({ message: "Owner not found" });
      return;
    }

    res.status(200).json(owner);
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
