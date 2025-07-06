import { Request, Response } from "express";

import AuthenticationRequest from "../../utils/authReq";
import placeModel from "../../models/place.model.js";
import userModel from "../../models/user.model.js";
import reserveModel from "../../models/reserve.model.js";
import * as placeValidator from "../../utils/validators/place.validator.js";
import isValidObjectId from "../../utils/isValidObjectId.js";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    // find all places
    const places = await placeModel.find({});
    res.status(200).json(places);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const create = async (
  req: AuthenticationRequest,
  res: Response
): Promise<void> => {
  try {
    // check req.body with Zod
    const validationResult = placeValidator.create(req.body);

    if (!validationResult.success) {
      res.status(422).json({ errors: validationResult.error.errors });
    }

    const { name, address, description, facilities, price, province, city } =
      req.body;

    // Check if the user who created the place owns it.
    const ownerExist = await userModel.findOne({ email: req.user.email });

    // If the user who created the place is not the owner, its role will change to owner.
    if (!ownerExist!.isOwner) {
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

    res.status(201).json(createPlace);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    // Validate id
    if (isValidObjectId(id)) {
      res.status(422).json({ message: "Id is not valid" });
    }

    // delete place
    const deletePlace = await placeModel.findByIdAndDelete({ _id: id });

    if (!deletePlace) {
      res.status(403).json({ message: "The place not found" });
    }

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const update = async (req: AuthenticationRequest, res: Response) => {
  try {
    // validate body with Zod

    const validationResult = placeValidator.create(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ error: validationResult.error.errors });
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

export const reserve = async (
  req: AuthenticationRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    // Validate id
    if (isValidObjectId(id)) {
      res.status(422).json({ message: "Id is not valid" });
    }

    // Find place that client want to reserve
    const placeInfo = await placeModel.findOne({ _id: id });

    // If place reserved these codes will run
    if (placeInfo!.isReserved) {
      res.status(409).json({ message: "Place already reserved" });
    }
    // Find user who want reserve a palace
    const userInfo = await userModel.findOne({ _id: req.user._id });
    // These codes will be executed if the user who submitted the request has reserved a place.
    if (userInfo!.isReserved) {
      res.status(409).json({ message: "User already reserved place" });
    }

    // Turn isReserved field in database to true (reservation operation completed)
    await placeModel.findByIdAndUpdate(
      { _id: placeInfo!._id },
      { isReserved: true }
    );
    await userModel.findByIdAndUpdate(
      { _id: userInfo!._id },
      { isReserved: true }
    );

    await reserveModel.create({ place: placeInfo!._id, user: req.user._id });

    res.status(200).json({
      message: "Place reserved successfully",
    });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const cancelReservation = async (
  req: AuthenticationRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    // Validate id
    if (isValidObjectId(id)) {
      res.status(422).json({ message: "Id is not valid" });
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

    res.status(200).json({
      message: "The reservation operation was successfully canceled.",
    });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
