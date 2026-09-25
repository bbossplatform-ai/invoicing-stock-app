import { nextId, products } from '../data/store.js';

export const listProducts = (req, res) => {
  return res.json(products);
};

export const createProduct = (req, res) => {
  const productData = req.body;

  const exists = products.some((product) => product.sku.toLowerCase() === productData.sku.toLowerCase());
  if (exists) {
    return res.status(409).json({ message: 'Product with this SKU already exists' });
  }

  const newProduct = {
    id: nextId(products),
    ...productData,
    unitPrice: Number(productData.unitPrice),
    costPrice: Number(productData.costPrice || 0),
    stockQuantity: Number(productData.stockQuantity || 0),
    reorderLevel: Number(productData.reorderLevel || 0),
  };

  products.push(newProduct);
  return res.status(201).json(newProduct);
};

export const updateProduct = (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((product) => product.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    unitPrice: Number(req.body.unitPrice),
    costPrice: Number(req.body.costPrice || 0),
    stockQuantity: Number(req.body.stockQuantity || 0),
    reorderLevel: Number(req.body.reorderLevel || 0),
  };

  return res.json(products[index]);
};

export const deleteProduct = (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((product) => product.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(index, 1);
  return res.status(204).send();
};
