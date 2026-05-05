import express from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

const handleUpload = (req, res, next) => {
  upload.single("photo")(req, res, function (err) {
    if (err) {
      console.error("UPLOAD ERROR:", err);

      return res.status(500).json({
        msg: err.message || err.error?.message || "Photo upload failed",
        error: err,
      });
    }

    next();
  });
};

// CREATE USER with file upload
router.post("/", handleUpload, createUser);

// GET ALL USERS
router.get("/", getUsers);

// GET SINGLE USER
router.get("/:id", getUserById);

// UPDATE USER with file upload
router.put("/:id", handleUpload, updateUser);

// DELETE USER
router.delete("/:id", deleteUser);
 console.log("USER ROUTES USING UPLOAD MIDDLEWARE");

export default router;