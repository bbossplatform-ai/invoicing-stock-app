import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { users, nextId, products, customers, invoices, stockMovements } from '../data/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = users.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = {
    id: nextId(users),
    name,
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'admin',
  };

  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  });
};

export const loginUser = (req, res) => {
  const { email, password } = req.body;

  const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};
