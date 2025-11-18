import express from 'express';
import { signIn, newUser } from '../controllers/controllerSignIn';
const router = express.Router();

router.post('/signIn', signIn);
router.post('/newUser', newUser);

export default router;