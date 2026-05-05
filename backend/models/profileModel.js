import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: String,
  country: String,
  state: String,
  city: String,
  zip: String,
  password: { type: String, required: true },
  profilePic: { type: String }, // Cloudinary URL
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;