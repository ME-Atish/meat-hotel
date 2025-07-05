const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    facilities: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isReserved: {
      type: Boolean,
      default: false,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
    },
    owner: {
      type: mongoose.Types.ObjectId,
      ref: "owner",
      required: true,
    },
  },
  {
    timestamp: true,
  }
);

const model = mongoose.model("place", schema);

module.exports = model;
