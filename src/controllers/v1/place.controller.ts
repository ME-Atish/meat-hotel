import { Request, Response } from "express";

import AuthenticationRequest from "../../utils/authReq";
import placeModel from "../../models/place.model.js";
import userModel from "../../models/user.model.js";
import reserveModel from "../../models/reserve.model.js";
import * as placeValidator from "../../utils/validators/place.validator.js";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    // find all places
    const places = await placeModel.findAll({ raw: true });
    res.status(200).json(places);
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
    // check req.body with Zod
    const validationResult = placeValidator.create(req.body);

    if (!validationResult.success) {
      res.status(422).json({ errors: validationResult.error.errors });
      return;
    }

    const { name, address, description, facilities, price, province, city } =
      req.body;

    const createPlace = await placeModel.create({
      name,
      address,
      description,
      facilities,
      price,
      province,
      city,
      isReserved: false,
      image: typedReq.files,
      ownerId: typedReq.user.id,
    });

    res.status(201).json(createPlace);
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const typedReq = req as AuthenticationRequest;

    // delete place
    const deletePlace = await placeModel.findOne({
      where: {
        id,
        ownerId: typedReq.user.id,
      },
    });

    if (!deletePlace) {
      res.status(403).json({ message: "The place not found" });
      return;
    }

    await deletePlace.destroy();

    res.status(200).json({ message: "Place deleted successfully" });
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    // Cast request to typedReq for use costume Request
    const typedReq = req as AuthenticationRequest;

    // validate body with Zod

    const validationResult = placeValidator.create(req.body);

    if (!validationResult.success) {
      res.status(422).json({ errors: validationResult.error.errors });
      return;
    }
    const { id } = req.params;

    const { name, address, description, facilities, price, province, city } =
      req.body;

    const findPlace = await placeModel.findOne({
      where: {
        id,
        ownerId: typedReq.user.id,
      },
    });

    if (!findPlace?.dataValues) {
      res.status(403).json({ message: "Place or villa not found" });
      return;
    }

    if (findPlace?.dataValues) {
      findPlace.set({
        name,
        address,
        description,
        facilities,
        price,
        province,
        city,
        image: typedReq.files,
        ownerId: typedReq.user.id,
      });
      findPlace.save();
    }

    res.status(200).json({ message: "Place updated successfully" });
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const reserve = async (req: Request, res: Response): Promise<void> => {
  try {
    // Cast request to typedReq for use costume Request
    const typedReq = req as AuthenticationRequest;

    const { id } = req.params;

    // Find place that client want to reserve
    const placeInfo = await placeModel.findOne({
      where: {
        id,
      },
    });

    // If place reserved these codes will run
    if (placeInfo?.dataValues.isReserved) {
      res.status(409).json({ message: "Place already reserved" });
      return;
    }
    // Find user who want reserve a palace
    const userInfo = await userModel.findOne({
      where: {
        id: typedReq.user.id,
      },
    });
    // These codes will be executed if the user who submitted the request has reserved a place.
    if (userInfo?.dataValues.isReserved) {
      res.status(409).json({ message: "User already reserved place" });
      return;
    }

    const updateReservedField = await placeModel.findOne({
      where: {
        id: placeInfo?.dataValues.id,
      },
    });
    if (updateReservedField?.dataValues) {
      updateReservedField.set({
        isReserved: 1,
      });

      updateReservedField.save();
    }

    const updateUserReservedField = await userModel.findOne({
      where: {
        id: userInfo?.dataValues.id,
      },
    });
    if (updateUserReservedField?.dataValues) {
      updateUserReservedField.set({
        isReserved: 1,
      });
      updateUserReservedField.save();
    }

    await reserveModel.create({
      placeId: placeInfo?.dataValues.id,
      userId: typedReq.user.id,
    });

    res.status(200).json({
      message: "Place reserved successfully",
    });
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const cancelReservation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Cast request to typedReq for use costume Request
    const typedReq = req as AuthenticationRequest;

    const { id } = req.params;

    const findReservation = await reserveModel.findOne({
      where: {
        id,
      },
    });

    if (!findReservation?.dataValues) {
      res.status(403).json({ message: "Reservation not found" });
      return;
    }

    // Cancel reservation operation
    const cancelPlaceReservationResult = await placeModel.findOne({
      where: {
        id: findReservation.dataValues.id,
      },
    });

    if (cancelPlaceReservationResult?.dataValues) {
      cancelPlaceReservationResult.set({
        isReserved: 0,
      });
      cancelPlaceReservationResult.save();
    }

    if (!cancelPlaceReservationResult?.dataValues) {
      res.status(403).json({ message: "Place not found" });
      return;
    }

    const cancelUserReservationResult = await userModel.findOne({
      where: {
        id: typedReq.user.id,
      },
    });

    if (!cancelUserReservationResult) {
      res.status(403).json({ message: "User not found" });
      return;
    }
    if (cancelUserReservationResult?.dataValues) {
      cancelUserReservationResult.set({
        isReserved: 0,
      });
      cancelUserReservationResult.save();
    }

    const findReservationForDelete = await reserveModel.findOne({
      where: {
        id,
      },
    });

    await findReservationForDelete?.destroy();

    res.status(200).json({
      message: "The reservation operation was successfully canceled.",
    });
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
