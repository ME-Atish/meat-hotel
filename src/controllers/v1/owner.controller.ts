import { Request, Response } from "express";

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

    // find owner to get it
    const owner = await userModel.findOne({
      where: {
        id,
        isOwner: 1,
      },
      raw: true,
    });

    if (!owner) {
      res.status(404).json({ message: "Owner not found" });
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

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    // Cast request to typedReq for use costume Request
    const typedReq = req as AuthenticationRequest;

    const findUser = await userModel.findOne({
      where: {
        id: typedReq.user.id,
      },
    });

    if (!findUser?.dataValues) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    // check if user already owner or not
    if (findUser.dataValues.isOwner) {
      res.status(400).json({ message: "You are already owner" });
      return;
    }

    // update isOwner field for convert user to owner
    findUser.set({
      isOwner: 1,
    });

    findUser.save();

    res.status(201).json({ message: "From now on, the user is an owner." });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const findUser = await userModel.findOne({
      where: {
        id,
        isOwner: 1,
      },
    });

    if (!findUser?.dataValues) {
      res.status(404).json({ message: "owner not found" });
      return;
    }

    // update isOwner field in database for convert owner to user
    findUser.set({
      isOwner: 0,
    });
    
    findUser.save()

    res.status(200).json({ message: "From now on, owner become user" });
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
