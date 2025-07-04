const hotelModel = require("../../models/hotel.model");

exports.get = async (req, res) => {
  try {
    const { keyword } = req.params;

    const search = await hotelModel.find({
      description: { $regex: ".*" + keyword + ".*" },
    });

    return res.status(200).json(search);

  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
