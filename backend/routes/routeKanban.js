import express from 'express';
import { getColumns, createColumn, updateColumn, deleteColumn, getCard, createCard, updateCard, deleteCard } from '../controllers/controllerKanban.js';
import { authToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/column', getColumns);
router.post('/column', createColumn);
router.put('/column/:id', updateColumn);
router.delete('/column/:id', deleteColumn);
router.get('/card', getCard);
router.post('/card', createCard);
router.put('/card/:id', updateCard);
router.delete('/card/:id', deleteCard);

export default router;