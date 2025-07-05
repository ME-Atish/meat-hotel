const placeModel = require("../../models/place.model");

exports.get = async (req, res) => {
  try {
    const { keyword } = req.params;

    // The keyword that the client sends is searched in the place descriptions.
    const search = await placeModel.find({
      description: { $regex: ".*" + keyword + ".*" },
    });

    return res.status(200).json(search);

  } catch (error) {
    if (error) {
      throw error;
    }
  }
};
