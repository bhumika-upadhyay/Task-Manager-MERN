import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    fullname: { type: String, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: { type: String, required: true },

    address: { type: String, default: "", trim: true },
    country: { type: String, default: "", trim: true },
    state: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    zip: { type: String, default: "", trim: true },
    phone: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    photo: { type: String, default: "" },

    resetPasswordToken: { type: String, default: "" },
    resetPasswordExpire: { type: Date, default: null },
  },
  { timestamps: true }
);

// fullname auto-generate before save
userSchema.pre("save", function (next) {
  this.fullname = `${this.firstname || ""} ${this.lastname || ""}`.trim();

});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
