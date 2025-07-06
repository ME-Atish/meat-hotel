const walletModel = require("../../models/wallet.model");
const walletValidator = require("../../utils/validators/wallet.validator");

exports.increase = async (req, res) => {
  try {
    // Validate data with Zod
    const validationResult = walletValidator.increase(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ error: validationResult.error.errors });
    }

    const { amount } = req.body;

    // Increase the account charge
    await walletModel.findOneAndUpdate(
      {
        userId: req.user._id,
      },
      {
        amount,
      }
    );

    return res.status(200).json({ message: "Account successfully charged." });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};

exports.decrease = async (req, res) => {
  try {
    // Validate data with Zod
    const validationResult = walletValidator.increase(req.body);

    if (!validationResult.success) {
      return res.status(422).json({ error: validationResult.error.errors });
    }

    const { amount } = req.body;
    // Find wallet for deducted amount
    const findWallet = await walletModel.findOne({ userId: req.user._id });
    // Check if the amount being sent is less than the account balance.
    if (findWallet.amount < amount) {
      return res.status(406).json({
        message: "The amount to be deducted is less than the account balance.",
      });
    }
    // Decrease amount
    const deductedAmount = findWallet.amount - amount;
    // Update model
    const updateAmount = await walletModel.findOneAndUpdate(
      { userId: req.user._id },
      { amount: deductedAmount }
    );

    if (!updateAmount) {
      return res.status(500).json({ message: "Something wrong..." });
    }

    res.status(200).json({ message: "The amount was successfully deducted." });
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
