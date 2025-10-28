import express from 'express';
import { getColumns, createColumn, updateColumn, deleteColumn } from '../controllers/controllerKanban.js';

const router = express.Router();

router.get('/column', getColumns);
router.post('/column', createColumn);
router.put('/column/:id', updateColumn);
router.delete('/column/:id', deleteColumn);

export default router;