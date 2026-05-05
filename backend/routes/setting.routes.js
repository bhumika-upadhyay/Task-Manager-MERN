import express from "express";
import {getsettings,updatesettings
} from "../controllers/settingController.js"


const router = express.Router();

router.get("/", protect, getsettings);      // get all
router.put("/:id", protect, updatesettings); // update


export default router;