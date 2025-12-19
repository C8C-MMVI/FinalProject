import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080/api/stock-records";
const PRODUCT_API_URL = "http://localhost:8080/api/products";
const SUPPLIER_API_URL = "http://localhost:8080/api/suppliers";

export default function StockRecords() {
  const { user } = useAuth();

  const [stockRecords, setStockRecords] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [deletingStock, setDeletingStock] = useState(null);

  useEffect(() => {
    if (!user?.token) return;

    const fetchData = async () => {
      try {
        const [stockRes, productRes, supplierRes] = await Promise.all([
          fetch(API_URL, { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch(PRODUCT_API_URL, { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch(SUPPLIER_API_URL, { headers: { Authorization: `Bearer ${user.token}` } }),
        ]);

        setStockRecords(await stockRes.json());
        setProducts(await productRes.json());
        setSuppliers(await supplierRes.json());
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [user]);

  const filteredStock = stockRecords.filter(sr => {
    const productName = products.find(p => Number(p.productId) === Number(sr.productId))?.productName || "";
    return productName.toLowerCase().includes(search.toLowerCase());
  });

  function openAddModal() {
    const today = new Date().toISOString().split("T")[0];
    setEditingStock({
      quantity: 0,
      unitPrice: 0,
      lastUpdated: today,
      productId: "",
      supplierId: "",
    });
    setModalOpen(true);
  }

  function openEditModal(stock) {
    setEditingStock({
      ...stock,
      productId: String(stock.productId),
      supplierId: String(stock.supplierId),
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingStock(null);
  }

  function openDeleteModal(stock) {
    setDeletingStock(stock);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setDeletingStock(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.token || !editingStock) return;

    const isEdit = Boolean(editingStock.stockRecordId);
    const url = isEdit ? `${API_URL}/${editingStock.stockRecordId}` : API_URL;

    const payload = {
      ...editingStock,
      productId: Number(editingStock.productId),
      supplierId: Number(editingStock.supplierId),
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save stock record");

      const saved = await res.json();

      setStockRecords(prev =>
        isEdit
          ? prev.map(sr => (sr.stockRecordId === saved.stockRecordId ? saved : sr))
          : [...prev, saved]
      );

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error saving stock record. Make sure all fields are filled correctly.");
    }
  }

  async function confirmDelete() {
    if (!user?.token || !deletingStock) return;

    try {
      const res = await fetch(`${API_URL}/${deletingStock.stockRecordId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Failed to delete stock record");

      setStockRecords(prev => prev.filter(sr => sr.stockRecordId !== deletingStock.stockRecordId));
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      alert("Error deleting stock record.");
    }
  }

  return (
    <div className="p-6 font-lexend">
      <h1 className="text-[48px] font-extrabold mb-4 text-black font-nunito uppercase">
        Stock Records
      </h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by product..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-64"
        />
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Stock
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#4C763B] text-white">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Supplier</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Unit Price</th>
              <th className="p-3 text-left">Last Updated</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-600">
                  No stock records found.
                </td>
              </tr>
            ) : (
              filteredStock.map(stock => {
                const productName = products.find(p => Number(p.productId) === Number(stock.productId))?.productName || "-";
                const supplierName = suppliers.find(s => Number(s.supplierId) === Number(stock.supplierId))?.name || "-";
                return (
                  <tr key={stock.stockRecordId} className="border-t">
                    <td className="p-3">{productName}</td>
                    <td className="p-3">{supplierName}</td>
                    <td className="p-3">{stock.quantity}</td>
                    <td className="p-3">₱{stock.unitPrice?.toFixed(2)}</td>
                    <td className="p-3">{stock.lastUpdated}</td>
                    <td className="p-3 flex justify-center space-x-2">
                      <button
                        onClick={() => openEditModal(stock)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(stock)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      {modalOpen && editingStock && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-[#4C763B]">
              {editingStock.stockRecordId ? "Edit Stock" : "Add Stock"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="font-medium">Product</label>
                <select
                  value={editingStock.productId}
                  onChange={e => {
                    const selectedProduct = products.find(p => p.productId === Number(e.target.value));
                    setEditingStock({ 
                      ...editingStock, 
                      productId: e.target.value,
                      unitPrice: selectedProduct?.basePrice || 0
                    });
                  }}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Product</option>
                  {products.map(p => (
                    <option key={p.productId} value={String(p.productId)}>
                      {p.productName} - ₱{p.basePrice?.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium">Supplier</label>
                <select
                  value={editingStock.supplierId}
                  onChange={e => setEditingStock({ ...editingStock, supplierId: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map(s => (
                    <option key={s.supplierId} value={String(s.supplierId)}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium">Quantity</label>
                <input
                  type="number"
                  value={editingStock.quantity}
                  onChange={e =>
                    setEditingStock({ ...editingStock, quantity: parseInt(e.target.value) })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                  min="0"
                />
              </div>

              <div>
                <label className="font-medium">Unit Price (from Product)</label>
                <input
                  type="number"
                  value={editingStock.unitPrice}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                  step="0.01"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unit price is automatically set from the product's base price
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && deletingStock && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this stock record for{" "}
              <span className="font-bold">
                {products.find(p => Number(p.productId) === Number(deletingStock.productId))?.productName || "this product"}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}