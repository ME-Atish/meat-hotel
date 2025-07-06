import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const model = mongoose.model("wallet", schema);

export default model;
