import bcrypt from 'bcryptjs';

export const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
  },
];

export const products = [
  {
    id: 1,
    name: 'Laptop Pro 14',
    sku: 'LAP-014',
    description: 'Business laptop',
    unitPrice: 1200,
    costPrice: 820,
    stockQuantity: 8,
    reorderLevel: 4,
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    sku: 'MOU-001',
    description: 'Ergonomic wireless mouse',
    unitPrice: 35,
    costPrice: 16,
    stockQuantity: 20,
    reorderLevel: 5,
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    sku: 'KEY-101',
    description: 'RGB mechanical keyboard',
    unitPrice: 90,
    costPrice: 46,
    stockQuantity: 6,
    reorderLevel: 3,
  },
];

export const customers = [
  {
    id: 1,
    name: 'Nova Tech Ltd',
    email: 'sales@novatech.com',
    phone: '+123456789',
    address: '25 Market Street',
  },
  {
    id: 2,
    name: 'Harbor Retail',
    email: 'hello@harborretail.com',
    phone: '+198765432',
    address: '18 Harbor Road',
  },
];

export const invoices = [];
export const stockMovements = [];

export const nextId = (array) => {
  return array.length ? Math.max(...array.map((item) => item.id)) + 1 : 1;
};
