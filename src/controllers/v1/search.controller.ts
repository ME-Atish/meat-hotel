import { Request, Response } from "express";

import placeModel from "../../models/place.model.js";
import { Op } from "sequelize";

export const get = async (req: Request, res: Response): Promise<void> => {
  try {
    const { keyword } = req.params;

    // The keyword that the client sends is searched in the place descriptions.
    const search = await placeModel.findAll({
      where: {
        description: { [Op.like]: `%${keyword}%` },
      },
    });

    const searchResult = search.map((items) => {
      return items.dataValues;
    });

    res.status(200).json(searchResult);
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
