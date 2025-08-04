import { Request, Response } from "express";
import AuthenticationRequest from "../../utils/authReq.js";

import walletModel from "../../models/wallet.model.js";
import * as walletValidator from "../../utils/validators/wallet.validator.js";

export const increase = async (req: Request, res: Response): Promise<void> => {
  try {
    // Cast request to typedReq for use costume Request
    const typedReq = req as AuthenticationRequest;

    // Validate data with Zod
    const validationResult = walletValidator.increase(req.body);

    if (!validationResult.success) {
      res.status(422).json({ error: validationResult.error.errors });
      return;
    }

    const { amount } = req.body;

    const findUserWallet = await walletModel.findOne({
      where: {
        userId: typedReq.user.id,
      },
    });

    if (!findUserWallet?.dataValues) {
      res
        .status(403)
        .json({ message: "Wallet not found. Maybe user id is not correct" });
    }

    // Increase the account charge
    if (findUserWallet?.dataValues) {
      findUserWallet.set({
        amount,
      });
      findUserWallet.save();
    }

    res.status(200).json({ message: "Account successfully charged." });
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

export const decrease = async (req: Request, res: Response): Promise<void> => {
  try {
    // Cast request to typedReq for use costume Request
    const typedReq = req as AuthenticationRequest;

    // Validate data with Zod
    const validationResult = walletValidator.increase(req.body);

    if (!validationResult.success) {
      res.status(422).json({ error: validationResult.error.errors });
      return;
    }

    const { amount } = req.body;
    // Find wallet for deducted amount
    const findWallet = await walletModel.findOne({
      where: {
        userId: typedReq.user.id,
      },
    });
    // Check if the amount being sent is less than the account balance.
    if (findWallet!.dataValues.amount < amount) {
      res.status(406).json({
        message: "The amount to be deducted is less than the account balance.",
      });
      return;
    }
    // Decrease amount
    const deductedAmount = findWallet!.dataValues.amount - amount;

    if (findWallet?.dataValues) {
      findWallet.set({
        amount: deductedAmount,
      });
      findWallet.save();
    }

    res.status(200).json({ message: "The amount was successfully deducted." });
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
