const mongoose = require("mongoose");

/**
 * Validation for object id
 *
 * @param string id
 *
 * @return void
 */
const isValidObjectid = (id) => {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

  if (!isValidObjectId) {
    return res.status(409).json({ message: "The id is not valid" });
  }
};

module.exports = isValidObjectid;
