import { useEffect, useMemo, useState } from 'react';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: 'admin@example.com', password: 'admin123' });
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [dashboard, setDashboard] = useState({
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
    unpaidInvoices: 0,
    lowStockProducts: [],
    recentMovements: [],
  });
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    description: '',
    unitPrice: 0,
    costPrice: 0,
    stockQuantity: 0,
    reorderLevel: 0,
  });
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [invoiceForm, setInvoiceForm] = useState({
    customerId: '',
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: '',
    items: [{ productId: '', quantity: 1 }],
  });

  const authHeaders = useMemo(() => ({
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  }), [token]);

  const apiRequest = async (endpoint, options = {}) => {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...authHeaders,
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  };

  const loadData = async () => {
    if (!token) return;

    try {
      const [productsData, customersData, invoicesData, dashboardData] = await Promise.all([
        apiRequest('/products'),
        apiRequest('/customers'),
        apiRequest('/invoices'),
        apiRequest('/dashboard/summary'),
      ]);

      setProducts(productsData);
      setCustomers(customersData);
      setInvoices(invoicesData);
      setDashboard(dashboardData);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Could not load data');
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  const handleAuthSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = authMode === 'register'
        ? { name: authForm.name, email: authForm.email, password: authForm.password }
        : { email: authForm.email, password: authForm.password };

      const result = await fetch(`${API_BASE}/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Authentication failed');
        return data;
      });

      localStorage.setItem('token', result.token);
      setToken(result.token);
      setAuthForm({ name: '', email: 'admin@example.com', password: 'admin123' });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await apiRequest('/products', {
        method: 'POST',
        body: JSON.stringify({ ...productForm, unitPrice: Number(productForm.unitPrice), costPrice: Number(productForm.costPrice), stockQuantity: Number(productForm.stockQuantity), reorderLevel: Number(productForm.reorderLevel) }),
      });

      setProducts((prev) => [result, ...prev]);
      setProductForm({ name: '', sku: '', description: '', unitPrice: 0, costPrice: 0, stockQuantity: 0, reorderLevel: 0 });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCustomerSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await apiRequest('/customers', {
        method: 'POST',
        body: JSON.stringify(customerForm),
      });

      setCustomers((prev) => [result, ...prev]);
      setCustomerForm({ name: '', email: '', phone: '', address: '' });
    } catch (error) {
      alert(error.message);
    }
  };

  const updateInvoiceItem = (index, field, value) => {
    setInvoiceForm((prev) => {
      const nextItems = [...prev.items];
      nextItems[index] = { ...nextItems[index], [field]: field === 'quantity' ? Number(value) : value };
      return { ...prev, items: nextItems };
    });
  };

  const addInvoiceItem = () => {
    setInvoiceForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }],
    }));
  };

  const removeInvoiceItem = (index) => {
    setInvoiceForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleInvoiceSubmit = async (event) => {
    event.preventDefault();

    try {
      const body = {
        customerId: Number(invoiceForm.customerId),
        invoiceDate: invoiceForm.invoiceDate,
        dueDate: invoiceForm.dueDate,
        items: invoiceForm.items.map((item) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
        })),
      };

      const result = await apiRequest('/invoices', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      setInvoices((prev) => [result, ...prev]);
      setInvoiceForm({
        customerId: '',
        invoiceDate: new Date().toISOString().slice(0, 10),
        dueDate: '',
        items: [{ productId: '', quantity: 1 }],
      });
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  if (!token) {
    return (
      <div className="auth-shell">
        <form className="auth-card" onSubmit={handleAuthSubmit}>
          <h1>Invoicing & Stock</h1>
          <p className="muted">Login or register your admin account</p>

          {authMode === 'register' && (
            <input
              type="text"
              value={authForm.name}
              placeholder="Full name"
              onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
            />
          )}

          <input
            type="email"
            value={authForm.email}
            placeholder="Email"
            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
          />

          <input
            type="password"
            value={authForm.password}
            placeholder="Password"
            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
          />

          <button type="submit">{authMode === 'login' ? 'Login' : 'Register'}</button>

          <button type="button" className="secondary" onClick={() => setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'))}>
            Switch to {authMode === 'login' ? 'register' : 'login'}
          </button>

          <small className="muted">Demo login: admin@example.com / admin123</small>
        </form>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h2>Business Dashboard</h2>
        </div>
        <button className="secondary" onClick={logout}>Logout</button>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Revenue</span>
          <strong>${Number(dashboard.totalRevenue || 0).toFixed(2)}</strong>
        </div>
        <div className="stat-card">
          <span>Products</span>
          <strong>{dashboard.totalProducts || 0}</strong>
        </div>
        <div className="stat-card">
          <span>Customers</span>
          <strong>{dashboard.totalCustomers || 0}</strong>
        </div>
        <div className="stat-card">
          <span>Unpaid Invoices</span>
          <strong>{dashboard.unpaidInvoices || 0}</strong>
        </div>
      </section>

      <div className="content-grid">
        <section className="panel">
          <h3>Add Product</h3>
          <form onSubmit={handleProductSubmit} className="stacked-form">
            <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product name" />
            <input value={productForm.sku} onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} placeholder="SKU" />
            <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Description" />
            <div className="two-col">
              <input type="number" value={productForm.unitPrice} onChange={(e) => setProductForm({ ...productForm, unitPrice: Number(e.target.value) })} placeholder="Unit price" />
              <input type="number" value={productForm.costPrice} onChange={(e) => setProductForm({ ...productForm, costPrice: Number(e.target.value) })} placeholder="Cost price" />
            </div>
            <div className="two-col">
              <input type="number" value={productForm.stockQuantity} onChange={(e) => setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })} placeholder="Stock qty" />
              <input type="number" value={productForm.reorderLevel} onChange={(e) => setProductForm({ ...productForm, reorderLevel: Number(e.target.value) })} placeholder="Reorder level" />
            </div>
            <button type="submit">Save Product</button>
          </form>
        </section>

        <section className="panel">
          <h3>Add Customer</h3>
          <form onSubmit={handleCustomerSubmit} className="stacked-form">
            <input value={customerForm.name} onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })} placeholder="Customer name" />
            <input type="email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} placeholder="Email" />
            <input value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} placeholder="Phone" />
            <textarea value={customerForm.address} onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })} placeholder="Address" />
            <button type="submit">Save Customer</button>
          </form>
        </section>
      </div>

      <div className="content-grid">
        <section className="panel wide-panel">
          <h3>Create Invoice</h3>
          <form onSubmit={handleInvoiceSubmit} className="stacked-form">
            <div className="two-col">
              <select value={invoiceForm.customerId} onChange={(e) => setInvoiceForm({ ...invoiceForm, customerId: e.target.value })}>
                <option value="">Select customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
              <input type="date" value={invoiceForm.invoiceDate} onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceDate: e.target.value })} />
            </div>
            <input type="date" value={invoiceForm.dueDate} onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })} placeholder="Due date" />

            {invoiceForm.items.map((line, index) => (
              <div className="invoice-row" key={index}>
                <select value={line.productId} onChange={(e) => updateInvoiceItem(index, 'productId', e.target.value)}>
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>{product.name} ({product.stockQuantity} in stock)</option>
                  ))}
                </select>
                <input type="number" min="1" value={line.quantity} onChange={(e) => updateInvoiceItem(index, 'quantity', e.target.value)} />
                <button type="button" className="secondary" onClick={() => removeInvoiceItem(index)}>Remove</button>
              </div>
            ))}

            <div className="button-row">
              <button type="button" className="secondary" onClick={addInvoiceItem}>Add Item</button>
              <button type="submit">Create Invoice</button>
            </div>
          </form>
        </section>
      </div>

      <div className="content-grid two-col-layout">
        <section className="panel">
          <h3>Products</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.sku}</td>
                  <td>{product.stockQuantity}</td>
                  <td>${Number(product.unitPrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h3>Low Stock</h3>
          <ul className="low-stock-list">
            {dashboard.lowStockProducts && dashboard.lowStockProducts.length ? (
              dashboard.lowStockProducts.map((product) => (
                <li key={product.id}>{product.name} - {product.stockQuantity} left</li>
              ))
            ) : (
              <li>No low-stock products</li>
            )}
          </ul>
        </section>
      </div>

      <section className="panel">
        <h3>Invoices</h3>
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.invoiceNumber}</td>
                <td>{customers.find((c) => c.id === invoice.customerId)?.name || 'Unknown'}</td>
                <td>{invoice.status}</td>
                <td>${Number(invoice.totalAmount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
