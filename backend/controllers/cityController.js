import City from "../models/CityModel.js";

// CREATE city
export const createCity = async (req, res) => {
  try {
    const { name, state, zipCodes } = req.body;

    if (!name || !state) {
      return res.status(400).json({ msg: "City name and state are required" });
    }

    const city = await City.create({
      name,
      state,
      zipCodes: zipCodes || [],
    });

    res.status(201).json(city);
  } catch (error) {
    console.error("Error creating city:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// GET all cities
export const getCities = async (req, res) => {
  try {
    const cities = await City.find().populate({
      path: "state",
      select: "name country", // 🔥 fixed
      populate: {
        path: "country",
        select: "name",
      },
    });

    res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching cities:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE city
export const updateCity = async (req, res) => {
  try {
    const { name, state, zipCodes } = req.body;

    const updated = await City.findByIdAndUpdate(
      req.params.id,
      { name, state, zipCodes },
      { returnDocument: "after" } // ✅ no warning
    );

    if (!updated) return res.status(404).json({ msg: "City not found" });

    res.json(updated);
  } catch (error) {
    console.error("Error updating city:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// DELETE city
export const deleteCity = async (req, res) => {
  try {
    const deleted = await City.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ msg: "City not found" });

    res.json({ msg: "City deleted successfully" });
  } catch (error) {
    console.error("Error deleting city:", error.message);
    res.status(500).json({ msg: error.message });
  }
};




