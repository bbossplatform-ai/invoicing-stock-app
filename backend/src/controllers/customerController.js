import { nextId, customers } from '../data/store.js';

export const listCustomers = (req, res) => {
  return res.json(customers);
};

export const createCustomer = (req, res) => {
  const newCustomer = {
    id: nextId(customers),
    ...req.body,
  };

  customers.push(newCustomer);
  return res.status(201).json(newCustomer);
};

export const updateCustomer = (req, res) => {
  const { id } = req.params;
  const index = customers.findIndex((customer) => customer.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  customers[index] = { ...customers[index], ...req.body };
  return res.json(customers[index]);
};

export const deleteCustomer = (req, res) => {
  const { id } = req.params;
  const index = customers.findIndex((customer) => customer.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  customers.splice(index, 1);
  return res.status(204).send();
};
