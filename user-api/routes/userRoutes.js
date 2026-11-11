import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateParams } from '../middlewares/validate.js';
import { userIdParamsSchema } from '../validators/userSchemas.js';

const router = Router();

// Order matters: reject unauthenticated requests before looking at the input.
router.get('/:id', authenticate, validateParams(userIdParamsSchema), userController.getUserById);

export default router;
