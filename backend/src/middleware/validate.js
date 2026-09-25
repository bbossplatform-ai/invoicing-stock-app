import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: 'Validation error',
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  req.body = result.data;
  return next();
};

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  description: z.string().optional().default(''),
  unitPrice: z.number().min(0),
  costPrice: z.number().min(0).optional().default(0),
  stockQuantity: z.number().int().min(0).default(0),
  reorderLevel: z.number().int().min(0).default(0),
});

export const customerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional().default(''),
  address: z.string().optional().default(''),
});

export const authSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export const invoiceItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const createInvoiceSchema = z.object({
  customerId: z.number().int().positive(),
  invoiceDate: z.string().min(1),
  dueDate: z.string().optional().or(z.literal('')),
  items: z.array(invoiceItemSchema).min(1),
});

export const paymentSchema = z.object({
  amount: z.number().positive(),
  paymentDate: z.string().min(1),
  method: z.string().optional().default('cash'),
});
