import { Request, Response } from "express";

import placeModel from "../../models/place.model.js";

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword } = req.params;

    // The keyword that the client sends is searched in the place descriptions.
    const search = await placeModel.find({
      description: { $regex: ".*" + keyword + ".*" },
    });

    res.status(200).json(search);
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
