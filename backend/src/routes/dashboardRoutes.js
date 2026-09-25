import express from 'express';
import { addPayment, createInvoice, getInvoiceById, listInvoices } from '../controllers/invoiceController.js';
import { requireAuth } from '../middleware/auth.js';
import { createInvoiceSchema, paymentSchema } from '../middleware/validate.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', requireAuth, listInvoices);
router.get('/:id', requireAuth, getInvoiceById);
router.post('/', requireAuth, validate(createInvoiceSchema), createInvoice);
router.post('/:id/payments', requireAuth, validate(paymentSchema), addPayment);

export default router;
