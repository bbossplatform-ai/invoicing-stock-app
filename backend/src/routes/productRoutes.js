import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import { authSchema } from '../middleware/validate.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', validate(authSchema), registerUser);
router.post('/login', validate(authSchema), loginUser);

export default router;
