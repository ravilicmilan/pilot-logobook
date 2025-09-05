import express from "express";
import {
  addNewEntry,
  getEntireLogBook,
  modifyEntry,
  removeEntry
} from "../controllers/logbookController.js";
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post("/logbook", addNewEntry);
router.get("/logbook", auth, getEntireLogBook);
router.put("/logbook/:id", modifyEntry);
router.delete("/logbook/:id", removeEntry);


export default router;