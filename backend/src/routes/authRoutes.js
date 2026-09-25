import { customers, invoices, products, stockMovements } from '../data/store.js';

export const getDashboardSummary = (req, res) => {
  const totalRevenue = invoices.reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((product) => product.stockQuantity <= product.reorderLevel);
  const unpaidInvoices = invoices.filter((invoice) => invoice.status !== 'paid').length;

  return res.json({
    totalRevenue: Number(totalRevenue.toFixed(2)),
    totalCustomers,
    totalProducts,
    unpaidInvoices,
    lowStockProducts,
    recentMovements: stockMovements.slice(-5).reverse(),
  });
};
