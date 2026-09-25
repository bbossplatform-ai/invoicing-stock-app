import express from 'express';
import { createProduct, deleteProduct, listProducts, updateProduct } from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';
import { productSchema } from '../middleware/validate.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.get('/', requireAuth, listProducts);
router.post('/', requireAuth, validate(productSchema), createProduct);
router.put('/:id', requireAuth, validate(productSchema), updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
