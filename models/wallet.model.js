const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    payment: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamp: true }
);

const model = mongoose.model("wallet", schema);

module.exports = model;
