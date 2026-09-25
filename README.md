# Invoicing & Stock Management App

A starter full-stack application for managing products, customers, invoices, payments, and stock movements.

## Features
- Product catalog with stock tracking
- Customer management
- Invoice creation and payment tracking
- Stock movement history
- Low-stock dashboard summary
- JWT-based authentication
- React frontend + Express backend

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Auth: JWT + bcrypt
- Data storage: in-memory demo store (ready to replace with PostgreSQL)

## Project Structure
- `backend/` - Express API and business logic
- `frontend/` - React dashboard and UI
- `backend/src/db/schema.sql` - PostgreSQL schema reference

## Getting Started

### 1) Install backend dependencies
```bash
cd backend
npm install
```

### 2) Install frontend dependencies
```bash
cd ../frontend
npm install
```

### 3) Start backend server
```bash
cd ../backend
npm run dev
```

### 4) Start frontend app
```bash
cd ../frontend
npm run dev
```

### 5) Login
Use the demo admin account:
- Email: `admin@example.com`
- Password: `admin123`

## Default API Base URL
- Backend: `http://localhost:5000/api`
- Frontend: `http://localhost:5173`

## Basic API Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `GET /api/customers`
- `POST /api/customers`
- `GET /api/invoices`
- `POST /api/invoices`
- `POST /api/invoices/:id/payments`
- `GET /api/dashboard/summary`

## Notes
This starter is built as a robust MVP foundation. You can later swap the in-memory data store for PostgreSQL or another database.
