import mongoose from "mongoose";

const schema = new mongoose.Schema(
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
    timestamps: true,
  }
);

const model = mongoose.model("reserve", schema);

export default model