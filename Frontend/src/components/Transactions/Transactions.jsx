import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { TransactionService } from "../../services/TransactionService";

export default function Transactions() {
  const { user } = useAuth();
  const transactionService = TransactionService(user?.token);

  const [transactions, setTransactions] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(""); // daily/weekly
  const [selectedMonth, setSelectedMonth] = useState(""); // monthly
  const [profitData, setProfitData] = useState(null);
  const [showProfit, setShowProfit] = useState(false);

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        const [txRes, prodRes] = await Promise.all([
          transactionService.getAll(),
          fetch("http://localhost:8080/api/products", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        const txData = await txRes;
        const prodData = await prodRes.json();

        setTransactions(txData);
        setProducts(prodData);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch transactions or products.");
      }
    };

    fetchData();
  }, [user]);

  const calculateProfit = () => {
    let filteredTransactions = [];
    let displayLabel = "";

    if (selectedPeriod === "daily") {
      if (!selectedDate) return alert("Please select a date.");
      filteredTransactions = transactions.filter((tx) => tx.transactionDate === selectedDate);
      displayLabel = selectedDate;
    }

    if (selectedPeriod === "weekly") {
      if (!selectedDate) return alert("Please select a date.");
      const date = new Date(selectedDate);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      filteredTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.transactionDate);
        return txDate >= weekStart && txDate <= weekEnd;
      });

      const options = { month: "short", day: "numeric" };
      displayLabel = `Week: ${weekStart.toLocaleDateString(undefined, options)} – ${weekEnd.toLocaleDateString(undefined, options)}, ${weekEnd.getFullYear()}`;
    }

    if (selectedPeriod === "monthly") {
      if (!selectedMonth) return alert("Please select a month.");
      const [year, month] = selectedMonth.split("-").map(Number);
      filteredTransactions = transactions.filter((tx) => {
        const txDate = new Date(tx.transactionDate);
        return txDate.getFullYear() === year && txDate.getMonth() + 1 === month;
      });

      const monthName = new Date(Number(year), Number(month) - 1).toLocaleString(undefined, { month: "long" });
      displayLabel = `${monthName} ${year}`;
    }

    if (filteredTransactions.length === 0) {
      setProfitData({ displayLabel, revenue: 0, cost: 0, profit: 0, count: 0, noData: true });
      return;
    }

    let totalRevenue = 0;
    let totalCost = 0;

    filteredTransactions.forEach((tx) => {
      tx.items?.forEach((item) => {
        totalRevenue += item.listPrice * item.quantity;
        totalCost += item.basePrice * item.quantity;
      });
    });

    setProfitData({
      displayLabel,
      revenue: totalRevenue,
      cost: totalCost,
      profit: totalRevenue - totalCost,
      count: filteredTransactions.length,
      noData: false,
    });
  };

  const handleShowProfit = () => {
    calculateProfit();
    setShowProfit(true);
  };

  const handleCloseProfit = () => {
    setShowProfit(false);
    setProfitData(null);
  };

  const viewReceipt = async (transactionId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/transaction-details/transaction/${transactionId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const data = await res.json();
      setSelectedDetails(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch transaction details.");
    }
  };

  const closeReceipt = () => setSelectedDetails([]);

  const calculateReceiptProfit = () => {
    return selectedDetails.reduce((sum, item) => {
      const revenue = item.listPrice * item.quantity;
      const cost = item.basePrice * item.quantity;
      return sum + (revenue - cost);
    }, 0);
  };

  return (
    <div className="p-6 font-lexend">
      <h1 className="text-[48px] font-extrabold mb-4 text-black font-nunito uppercase">
        Transactions
      </h1>

      {/* Profit Controls */}
      <div className="mb-6 bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-[#4C763B]">Profit Overview</h2>

        <div className="flex items-center gap-4 mb-4">
          <label className="font-medium">Period:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          {selectedPeriod === "daily" || selectedPeriod === "weekly" ? (
            <>
              <label className="font-medium">Select Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-lg px-4 py-2"
              />
            </>
          ) : (
            <>
              <label className="font-medium">Select Month:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border rounded-lg px-4 py-2"
              />
            </>
          )}

          <button
            onClick={handleShowProfit}
            className="px-4 py-2 bg-[#4C763B] text-white rounded hover:bg-[#3d5f2f]"
          >
            Show Profit
          </button>
        </div>

        {showProfit && profitData && (
          <div className="mt-4 border rounded-lg p-4 bg-gray-50 relative">
            <button
              onClick={handleCloseProfit}
              className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Close
            </button>

            {profitData.noData ? (
              <p className="text-center text-gray-500 italic">
                No transactions found for this period.
              </p>
            ) : (
              <div className="space-y-2">
                <p className="font-bold text-lg mb-2">{profitData.displayLabel}</p>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transactions:</span>
                  <span className="font-semibold">{profitData.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-semibold text-green-600">
                    ₱{profitData.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cost:</span>
                  <span className="font-semibold text-red-600">
                    ₱{profitData.cost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-bold text-lg">Profit:</span>
                  <span className={`font-bold text-lg ${profitData.profit >= 0 ? "text-[#4C763B]" : "text-red-600"}`}>
                    ₱{profitData.profit.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#4C763B] text-white">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.transactionId} className="border-t">
                <td className="p-3">{tx.transactionId}</td>
                <td className="p-3">{tx.transactionDate}</td>
                <td className="p-3">₱{tx.totalAmount?.toFixed(2)}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => viewReceipt(tx.transactionId)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    View Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal */}
      {selectedDetails.length > 0 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#4C763B]">Transaction Receipt</h2>
              <button
                onClick={closeReceipt}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="border-t border-b py-4 space-y-3">
              {selectedDetails.map((item) => {
                const productId = item.productId || item.product?.productId || item.productID;
                const product = products.find(p => Number(p.productId) === Number(productId));
                const productName = product?.productName || item.product?.productName || item.productName || `Product ID: ${productId}`;
                
                return (
                  <div key={item.transactionDetailsId}>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{productName}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₱{item.listPrice?.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-bold">₱{(item.quantity * item.listPrice)?.toFixed(2)}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Cost: ₱{item.basePrice?.toFixed(2)} × {item.quantity} = ₱{(item.basePrice * item.quantity)?.toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-lg">
                <span>Revenue:</span>
                <span className="font-bold text-green-600">
                  ₱{selectedDetails.reduce((sum, item) => sum + (item.quantity * item.listPrice), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Cost:</span>
                <span className="font-bold text-red-600">
                  ₱{selectedDetails.reduce((sum, item) => sum + (item.quantity * item.basePrice), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Profit:</span>
                <span className="text-[#4C763B]">
                  ₱{calculateReceiptProfit().toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={closeReceipt}
              className="w-full mt-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
