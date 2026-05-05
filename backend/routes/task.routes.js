

import express from "express";
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);   // create
router.get("/", protect, getTasks);      // get all
router.put("/:id", protect, updateTask); // update
router.delete("/:id", protect, deleteTask); // delete

export default router;