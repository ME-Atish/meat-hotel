import { Request, Response } from "express";

import placeModel from "@/models/place.model";
import userModel from "@/models/user.model";
import reserveModel from "@/models/reserve.model";
import * as placeValidator from "@/utils/validators/place.validator";
import isValidObjectId from "@/utils/isValidObjectId";
import { ValidatedRequest } from "@/types/validated-request";

export const getAll = async (_: Request, res: Response) => {
  try {
    // find all places
    const places = await placeModel.find({});
    return res.status(200).json(places);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const create = async (req: ValidatedRequest, res: Response) => {
  try {
    // check req.body with Zod
    const validationResult = placeValidator.create(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ errors: validationResult.error.message });
    }

    const { name, address, description, facilities, price, province, city } =
      req.body;

    const ownerExist = await userModel.findOne({ email: req.user.email });

    // check if the user exists
    if (!ownerExist) {
      return res.status(404).json({ message: "the user doesn't exist" });
    }

    // If the user who created the place is not the owner, its role will change to owner.
    if (!ownerExist.isOwner) {
      await userModel.findByIdAndUpdate(
        { _id: req.user._id },
        { isOwner: true }
      );
    }

    const createPlace = await placeModel.create({
      name,
      address,
      description,
      facilities,
      price,
      province,
      city,
      isReserved: false,
      image: req.files,
      owner: req.user,
    });

    return res.status(201).json(createPlace);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const destroy = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    // delete place
    const deletePlace = await placeModel.findByIdAndDelete({ _id: id });

    if (!deletePlace) {
      return res.status(403).json({ message: "The place not found" });
    }

    return res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const update = async (req: ValidatedRequest, res: Response) => {
  try {
    // validate body with Zod

    const validationResult = placeValidator.create(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ error: validationResult.error.message });
    }

    const { id } = req.params;

    // validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    const { name, address, description, facilities, price, province, city } =
      req.body;

    // update place's information
    const updatePlace = await placeModel.findByIdAndUpdate(
      { _id: id },
      {
        name,
        address,
        description,
        facilities,
        price,
        province,
        city,
        image: req.files,
        owner: req.user._id,
      }
    );
    if (!updatePlace) {
      return res.status(403).json({ message: "Place not found" });
    }

    return res.status(200).json({ message: "Place updated successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const reserve = async (req: ValidatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    // Find place that client want to reserve
    const placeInfo = await placeModel.findOne({ _id: id });

    // check if place info exist
    if (!placeInfo) {
      return res.status(404).json({ message: "entity not found" });
    }

    // If place reserved these codes will run
    if (placeInfo.isReserved) {
      return res.status(409).json({ message: "Place already reserved" });
    }

    // Find user who want reserve a palace
    const userInfo = await userModel.findOne({ _id: req.user._id });

    // check if user info exist
    if (!userInfo) {
      return res.status(404).json({ message: "entity not found" });
    }

    // These codes will be executed if the user who submitted the request has reserved a place.
    if (userInfo.isReserved) {
      return res.status(409).json({ message: "User already reserved place" });
    }

    // Turn isReserved field in database to true (reservation operation completed)
    await placeModel.findByIdAndUpdate(
      { _id: placeInfo._id },
      { isReserved: true }
    );
    await userModel.findByIdAndUpdate(
      { _id: userInfo._id },
      { isReserved: true }
    );

    await reserveModel.create({ place: placeInfo._id, user: req.user._id });

    return res.status(200).json({
      message: "Place reserved successfully",
    });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const cancelReservation = async (req: ValidatedRequest, res: Response) =>  {
  try {
    const { id } = req.params;
    
    // Validate id
    if (isValidObjectId(id)) {
      return res.status(422).json({ message: "Id is not valid" });
    }

    // Cancel reservation operation
    await placeModel.findByIdAndUpdate(
      { _id: id },
      {
        isReserved: false,
      }
    );

    await userModel.findByIdAndUpdate(
      { _id: req.user._id },
      {
        isReserved: false,
      }
    );

    return res.status(200).json({
      message: "The reservation operation was successfully canceled.",
    });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
