import express from "express";
import {
  createCountry,
  getCountries,
  updateCountry,
  deleteCountry,
} from "../controllers/countryController.js";

const router = express.Router();

// Create Country
router.post("/", createCountry);

// Get All Countries
router.get("/", getCountries);
router.put("/:id", updateCountry);
router.delete("/:id", deleteCountry);

export default router;