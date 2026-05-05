


import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/usermodel.js";

// CREATE USER
export const createUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      address = "",
      city = "",
      state = "",
      country = "",
      zip = "",
      phone = "",
      status = "active",
    } = req.body || {};

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const exist = await User.findOne({ email: normalizedEmail });
    if (exist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      fullname: `${firstname.trim()} ${lastname.trim()}`.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      country: country.trim(),
      zip: zip.trim(),
      phone: phone.trim(),
      status,
      photo: req.file ? req.file.path : "",
    });

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.resetPasswordToken;
    delete userResponse.resetPasswordExpire;

    res.status(201).json({
      msg: "User created successfully",
      user: userResponse,
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const { search, status, city, state, country } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { fullname: { $regex: search, $options: "i" } },
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (city) query.city = { $regex: city, $options: "i" };
    if (state) query.state = { $regex: state, $options: "i" };
    if (country) query.country = { $regex: country, $options: "i" };

    const users = await User.find(query)
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};

// GET SINGLE USER BY ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id).select(
      "-password -resetPasswordToken -resetPasswordExpire"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("GET USER BY ID ERROR:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid user ID" });
  }

  try {
    const updateData = { ...req.body };

    if (updateData.firstname) updateData.firstname = updateData.firstname.trim();
    if (updateData.lastname) updateData.lastname = updateData.lastname.trim();
    if (updateData.email) updateData.email = updateData.email.trim().toLowerCase();
    if (updateData.address) updateData.address = updateData.address.trim();
    if (updateData.city) updateData.city = updateData.city.trim();
    if (updateData.state) updateData.state = updateData.state.trim();
    if (updateData.country) updateData.country = updateData.country.trim();
    if (updateData.zip) updateData.zip = updateData.zip.trim();
    if (updateData.phone) updateData.phone = updateData.phone.trim();

    if (updateData.firstname || updateData.lastname) {
      const existingUser = await User.findById(id);

      if (!existingUser) {
        return res.status(404).json({ msg: "User not found" });
      }

      updateData.fullname = `${
        updateData.firstname || existingUser.firstname
      } ${updateData.lastname || existingUser.lastname}`.trim();
    }

    if (updateData.email) {
      const existingEmailUser = await User.findOne({
        email: updateData.email,
        _id: { $ne: id },
      });

      if (existingEmailUser) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }

    if (req.file) {
      updateData.photo = req.file.path;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    }).select("-password -resetPasswordToken -resetPasswordExpire");

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: "Invalid user ID" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ msg: err.message || "Server error" });
  }
};
