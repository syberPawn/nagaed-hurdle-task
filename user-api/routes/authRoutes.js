import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validateBody } from '../middlewares/validate.js';
import { registerSchema, loginSchema } from '../validators/authSchemas.js';

const router = Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);

export default router;
