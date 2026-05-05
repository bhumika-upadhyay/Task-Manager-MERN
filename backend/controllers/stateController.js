import State from "../models/StateModel.js";

// CREATE state
export const createState = async (req, res) => {
  try {
    const { name, country } = req.body;

    // ✅ validation
    if (!name || !country) {
      return res.status(400).json({ msg: "State name and country are required" });
    }

    const state = await State.create({ name, country });
    res.status(201).json(state);
  } catch (error) {
    console.error("Error creating state:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// GET states
export const getStates = async (req, res) => {
  try {
    const states = await State.find().populate("country", "name");
    res.status(200).json(states);
  } catch (error) {
    console.error("Error fetching states:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE state
export const updateState = async (req, res) => {
  try {
    const { name, country } = req.body;

    const updated = await State.findByIdAndUpdate(
      req.params.id,
      { name, country },
      { returnDocument: "after" }
    );

    if (!updated) return res.status(404).json({ msg: "State not found" });

    res.json(updated);
  } catch (error) {
    console.error("Error updating state:", error.message);
    res.status(500).json({ msg: error.message });
  }
};

// DELETE state
export const deleteState = async (req, res) => {
  try {
    const deleted = await State.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ msg: "State not found" });

    res.json({ msg: "State deleted successfully" });
  } catch (error) {
    console.error("Error deleting state:", error.message);
    res.status(500).json({ msg: error.message });
  }
};