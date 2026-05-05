import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      address,
      country,
      state,
      city,
      zip,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password required" });
    }

    const formattedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: formattedEmail });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email: formattedEmail,
      password: hashedPassword,
      address,
      country,
      state,
      city,
      zip,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: pwd, ...userData } = user._doc;

    res.status(201).json({
      success: true,
      user: userData,
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const formattedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: formattedEmail });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const { password: pwd, ...userData } = user._doc;

    res.status(200).json({
      success: true,
      user: userData,
      token,
      message: "Login successful",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

// ================= FORGOT PASSWORD =================
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const formattedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: formattedEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
    console.log("Reset URL:", resetUrl);

    res.status(200).json({
      success: true,
      message: "Reset link generated",
      resetUrl,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const token = req.params.token;

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// ================= LOGOUT =================
export const logoutUser = async (req, res) => {
  try {
    // Agar future me cookies use karogi toh useful hoga
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
