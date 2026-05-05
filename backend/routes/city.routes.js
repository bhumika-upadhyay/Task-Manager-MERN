import express from "express";
import {
  createCity,
  getCities,
  updateCity,
  deleteCity,
} from "../controllers/cityController.js";

const router = express.Router();

// CREATE
router.post("/", createCity);

// READ
router.get("/", getCities);

// UPDATE
router.put("/:id", updateCity);

// DELETE
router.delete("/:id", deleteCity);

export default router;

