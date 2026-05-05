import Country from "../models/CountryModel.js";

// CREATE country
export const createCountry = async (req, res) => {
  try {
    const { countryName } = req.body;

    if (!countryName || !countryName.trim()) {
      return res.status(400).json({ msg: "Country name is required" });
    }

    const existingCountry = await Country.findOne({
      name: countryName.trim().toUpperCase(),
    });

    if (existingCountry) {
      return res.status(400).json({ msg: "Country already exists" });
    }

    const country = await Country.create({
      name: countryName.trim(),
    });

    return res.status(201).json({
      msg: "Country created successfully",
      country,
    });
  } catch (error) {
    console.error("Error creating country:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

// GET all countries
export const getCountries = async (req, res) => {
  try {
    const countries = await Country.find().sort({ name: 1 });

    return res.status(200).json({
      count: countries.length,
      countries,
    });
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE country
export const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { countryName } = req.body;

    if (!countryName || !countryName.trim()) {
      return res.status(400).json({ msg: "Country name is required" });
    }

    const existingCountry = await Country.findOne({
      name: countryName.trim().toUpperCase(),
      _id: { $ne: id },
    });

    if (existingCountry) {
      return res.status(400).json({ msg: "Country already exists" });
    }

    const updatedCountry = await Country.findByIdAndUpdate(
      id,
      { name: countryName.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedCountry) {
      return res.status(404).json({ msg: "Country not found" });
    }

    return res.status(200).json({
      msg: "Country updated successfully",
      country: updatedCountry,
    });
  } catch (error) {
    console.error("Error updating country:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};

// DELETE country
export const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCountry = await Country.findByIdAndDelete(id);

    if (!deletedCountry) {
      return res.status(404).json({ msg: "Country not found" });
    }

    return res.status(200).json({
      msg: "Country deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting country:", error.message);
    return res.status(500).json({ msg: "Server error" });
  }
};