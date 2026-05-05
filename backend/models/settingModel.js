import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  theme: { type: String, default: "light" },
  notifications: { type: Boolean, default: true },
  tasksPerPage: { type: Number, default: 10 },
}, { timestamps: true });

export default mongoose.model("Settings", SettingsSchema);