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

    // Increase the account charge
    await walletModel.findOneAndUpdate(
      {
        userId: typedReq.user._id,
      },
      {
        amount,
      }
    );

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
    const findWallet = await walletModel.findOne({ userId: typedReq.user._id });
    // Check if the amount being sent is less than the account balance.
    if (findWallet!.amount < amount) {
      res.status(406).json({
        message: "The amount to be deducted is less than the account balance.",
      });
      return;
    }
    // Decrease amount
    const deductedAmount = findWallet!.amount - amount;
    // Update model
    const updateAmount = await walletModel.findOneAndUpdate(
      { userId: typedReq.user._id },
      { amount: deductedAmount }
    );

    if (!updateAmount) {
      res.status(500).json({ message: "Something wrong..." });
      return;
    }

    res.status(200).json({ message: "The amount was successfully deducted." });
    return;
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
