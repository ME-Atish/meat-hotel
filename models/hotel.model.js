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
    details: {
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
      type: Number,
      default: 0,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    HotelGuests: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
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

const model = mongoose.model("hotel", schema);

module.exports = model;
