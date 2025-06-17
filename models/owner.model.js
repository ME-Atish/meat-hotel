const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    
  },
  { timestamp: true }
);

const model = mongoose.model("owner", schema);

module.exports = model;
