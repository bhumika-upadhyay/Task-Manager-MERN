import mongoose from "mongoose";

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Country name is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create Model
const Country = mongoose.model("Country", countrySchema);

export default Country;
