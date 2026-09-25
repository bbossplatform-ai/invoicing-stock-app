import { generateInvoiceNumber } from '../utils/invoiceNumber.js';
import { customers, invoices, nextId, products, stockMovements } from '../data/store.js';

export const listInvoices = (req, res) => {
  return res.json(invoices.map((invoice) => ({
    ...invoice,
    customer: customers.find((customer) => customer.id === invoice.customerId),
  })));
};

export const getInvoiceById = (req, res) => {
  const { id } = req.params;
  const invoice = invoices.find((item) => item.id === Number(id));

  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  return res.json({
    ...invoice,
    customer: customers.find((customer) => customer.id === invoice.customerId),
  });
};

export const createInvoice = (req, res) => {
  const { customerId, invoiceDate, dueDate, items } = req.body;

  const customer = customers.find((entry) => entry.id === Number(customerId));
  if (!customer) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  const invoiceItems = [];
  let total = 0;

  for (const item of items) {
    const product = products.find((entry) => entry.id === Number(item.productId));

    if (!product) {
      return res.status(404).json({ message: `Product #${item.productId} not found` });
    }

    if (product.stockQuantity < item.quantity) {
      return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }

    const subtotal = Number(product.unitPrice) * Number(item.quantity);
    total += subtotal;

    product.stockQuantity -= Number(item.quantity);

    stockMovements.push({
      id: nextId(stockMovements),
      productId: product.id,
      movementType: 'sale',
      quantity: Number(item.quantity),
      reference: 'invoice',
      notes: `Sold on invoice`,
      createdAt: new Date().toISOString(),
    });

    invoiceItems.push({
      productId: product.id,
      quantity: Number(item.quantity),
      unitPrice: Number(product.unitPrice),
      subtotal,
    });
  }

  const invoice = {
    id: nextId(invoices),
    invoiceNumber: generateInvoiceNumber(),
    customerId: Number(customerId),
    invoiceDate,
    dueDate: dueDate || '',
    totalAmount: Number(total.toFixed(2)),
    status: 'unpaid',
    createdAt: new Date().toISOString(),
    items: invoiceItems,
  };

  invoices.push(invoice);

  return res.status(201).json(invoice);
};

export const addPayment = (req, res) => {
  const { id } = req.params;
  const { amount, paymentDate, method } = req.body;

  const invoice = invoices.find((entry) => entry.id === Number(id));
  if (!invoice) {
    return res.status(404).json({ message: 'Invoice not found' });
  }

  const payment = {
    id: nextId(invoice.payments || []),
    invoiceId: Number(id),
    amount: Number(amount),
    paymentDate,
    method: method || 'cash',
    createdAt: new Date().toISOString(),
  };

  if (!invoice.payments) {
    invoice.payments = [];
  }

  invoice.payments.push(payment);

  const totalPaid = invoice.payments.reduce((sum, item) => sum + Number(item.amount), 0);
  invoice.status = totalPaid >= Number(invoice.totalAmount) ? 'paid' : 'partial';

  return res.status(201).json(payment);
};
