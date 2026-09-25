import express from 'express';
import { createCustomer, deleteCustomer, listCustomers, updateCustomer } from '../controllers/customerController.js';
import { requireAuth } from '../middleware/auth.js';
import { customerSchema } from '../middleware/validate.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', requireAuth, listCustomers);
router.post('/', requireAuth, validate(customerSchema), createCustomer);
router.put('/:id', requireAuth, validate(customerSchema), updateCustomer);
router.delete('/:id', requireAuth, deleteCustomer);

export default router;
