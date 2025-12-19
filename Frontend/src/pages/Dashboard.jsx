import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    todaySales: 0,
    todayProfit: 0,
    totalSuppliers: 0,
    todayTransactions: 0,
  });
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      const [productsRes, stockRes, suppliersRes, transactionsRes] = await Promise.all([
        fetch("http://localhost:8080/api/products", { headers: { Authorization: `Bearer ${user.token}` } }),
        fetch("http://localhost:8080/api/stock-records", { headers: { Authorization: `Bearer ${user.token}` } }),
        fetch("http://localhost:8080/api/suppliers", { headers: { Authorization: `Bearer ${user.token}` } }),
        fetch("http://localhost:8080/api/transactions", { headers: { Authorization: `Bearer ${user.token}` } }),
      ]);

      const products = await productsRes.json();
      const stockRecords = await stockRes.json();
      const suppliers = await suppliersRes.json();
      const transactions = await transactionsRes.json();

      // Map stock by productId
      const stockByProduct = new Map();
      stockRecords.forEach(sr => stockByProduct.set(sr.productId, (stockByProduct.get(sr.productId) || 0) + sr.quantity));

      // Low stock items
      const lowStock = products
        .map(p => ({ ...p, stock: stockByProduct.get(p.productId) || 0 }))
        .filter(p => p.stock < 10 && p.stock > 0)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5);

      // Today's transactions
      const todayTx = transactions.filter(tx => tx.transactionDate === today);
      const todaySales = todayTx.reduce((sum, tx) => sum + tx.totalAmount, 0);

      // Fetch all transaction details concurrently for today's profit
      const todayProfit = await Promise.all(
        todayTx.map(async tx => {
          try {
            const res = await fetch(
              `http://localhost:8080/api/transaction-details/transaction/${tx.transactionId}`,
              { headers: { Authorization: `Bearer ${user.token}` } }
            );
            const details = await res.json();
            return details.reduce((sum, item) => sum + (item.listPrice - item.basePrice) * item.quantity, 0);
          } catch (err) {
            console.error(err);
            return 0;
          }
        })
      ).then(profits => profits.reduce((sum, p) => sum + p, 0));

      const recent = transactions.sort((a, b) => b.transactionId - a.transactionId).slice(0, 5);

      setStats({
        totalProducts: products.length,
        lowStockCount: lowStock.length,
        todaySales,
        todayProfit,
        totalSuppliers: suppliers.length,
        todayTransactions: todayTx.length,
      });
      setLowStockItems(lowStock);
      setRecentTransactions(recent);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="p-6 font-lexend">
      <h1 className="text-[48px] font-extrabold mb-6 text-black font-nunito uppercase">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500 mb-1">Total Products</p>
          <p className="text-3xl font-bold text-[#4C763B]">{stats.totalProducts}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500 mb-1">Low Stock Items</p>
          <p className="text-3xl font-bold text-orange-600">{stats.lowStockCount}</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500 mb-1">Today's Sales</p>
          <p className="text-3xl font-bold text-blue-600">₱{stats.todaySales.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">{stats.todayTransactions} transactions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-sm text-gray-500 mb-1">Today's Profit</p>
          <p className="text-3xl font-bold text-green-600">₱{stats.todayProfit.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#4C763B]">Low Stock Alerts</h2>
            <Link to="/stock" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          {lowStockItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">All products well-stocked!</p>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map(item => (
                <div key={item.productId} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">{item.productName}</p>
                    <p className="text-xs text-gray-500">{item.category?.categoryName}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${item.stock < 5 ? 'text-red-600' : 'text-orange-600'}`}>{item.stock} left</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#4C763B]">Recent Transactions</h2>
            <Link to="/transactions" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map(tx => (
                <div key={tx.transactionId} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-semibold">Transaction #{tx.transactionId}</p>
                    <p className="text-xs text-gray-500">{tx.transactionDate}</p>
                  </div>
                  <p className="font-bold text-[#4C763B]">₱{tx.totalAmount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold text-[#4C763B] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/pos" className="flex flex-col items-center justify-center p-4 border-2 border-[#4C763B] rounded-lg hover:bg-[#4C763B] hover:text-white transition">
            <span className="material-symbols-outlined text-4xl mb-2">point_of_sale</span>
            <span className="font-semibold">New Sale</span>
          </Link>

          <Link to="/products" className="flex flex-col items-center justify-center p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition">
            <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
            <span className="font-semibold">Manage Products</span>
          </Link>

          <Link to="/stock" className="flex flex-col items-center justify-center p-4 border-2 border-orange-600 rounded-lg hover:bg-orange-600 hover:text-white transition">
            <span className="material-symbols-outlined text-4xl mb-2">box</span>
            <span className="font-semibold">Stock Records</span>
          </Link>

          <Link to="/transactions" className="flex flex-col items-center justify-center p-4 border-2 border-green-600 rounded-lg hover:bg-green-600 hover:text-white transition">
            <span className="material-symbols-outlined text-4xl mb-2">finance</span>
            <span className="font-semibold">View Reports</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
