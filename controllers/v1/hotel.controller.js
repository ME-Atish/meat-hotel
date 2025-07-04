const hotelModel = require("../../models/hotel.model");

exports.getAll = async (req, res) => {
  try {
    const hotels = await hotelModel.find({});
    return res.json(hotels);
  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
