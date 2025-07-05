const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    place: {
      type: mongoose.Types.ObjectId,
      ref: "place",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

const model = mongoose.model("reserve", schema);

module.exports = model;
