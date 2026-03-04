import express from 'express';
import { getLogs, getLogById } from '../controllers/logController.js';

const router = express.Router();

router.get('/', getLogs);
router.get('/:id', getLogById);

export default router;