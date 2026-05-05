import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";


const router = express.Router();

router.get("/:id", getProfile);
router.put("/:id", upload.single("profilePic"), updateProfile);

export default router;