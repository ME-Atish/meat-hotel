import { Request, Response } from "express";

import placeModel from "@/models/place.model";

export const get = async (req: Request, res: Response) =>  {
  try {
    const { keyword } = req.params;

    // The keyword that the client sends is searched in the place descriptions.
    const search = await placeModel.find({
      description: { $regex: ".*" + keyword + ".*" },
    });

    return res.status(200).json(search);

  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
