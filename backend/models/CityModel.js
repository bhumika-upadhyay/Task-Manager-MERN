import mongoose from "mongoose";

const citySchema = new mongoose.Schema(
  {
    name: {   // changed from cityName → name
      type: String,
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
    zipCodes: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const City = mongoose.model("City", citySchema);

export default City;












