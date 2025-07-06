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
