import express from 'express';
import {
  addNewEntry,
  getEntireLogBook,
  modifyEntry,
  removeEntry,
} from '../controllers/logbookController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/logbook', auth, addNewEntry);
router.get('/logbook', auth, getEntireLogBook);
router.put('/logbook/:id', auth, modifyEntry);
router.delete('/logbook/:id', auth, removeEntry);

export default router;
