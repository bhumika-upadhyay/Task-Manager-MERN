
import express from "express";
import { getStates, createState, updateState, deleteState } from "../controllers/stateController.js";

const router = express.Router();

router.get("/", getStates);
router.post("/", createState);
router.put("/:id", updateState);
router.delete("/:id", deleteState);

export default router;