const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    isReserved: {
      type: Number,
      default: 0,
    },
    refreshToken: String,
  },
  { timestamp: true }
);

const model = mongoose.model("user", schema);

module.exports = model;
