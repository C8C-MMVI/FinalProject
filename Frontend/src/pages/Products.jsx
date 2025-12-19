import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080/api/products";
const CATEGORY_API_URL = "http://localhost:8080/api/categories";

export default function Products() {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  useEffect(() => {
    if (!user?.token) return;

    fetch(API_URL, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error);

    fetch(CATEGORY_API_URL, { headers: { Authorization: `Bearer ${user.token}` } })
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error);
  }, [user]);

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(search.toLowerCase())
  );

  function openAddModal() {
    setEditingProduct({
      productName: "",
      description: "",
      basePrice: 0,
      listPrice: 0,
      categoryId: categories.length > 0 ? categories[0].categoryId : null
    });
    setModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct({
      ...product,
      categoryId: product.categoryId || (categories[0]?.categoryId || null)
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProduct(null);
  }

  function openDeleteModal(product) {
    setDeletingProduct(product);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setDeletingProduct(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.token || !editingProduct) return;

    const isEdit = Boolean(editingProduct.productId);
    const url = isEdit ? `${API_URL}/${editingProduct.productId}` : API_URL;

    const payload = { ...editingProduct };

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");

      const saved = await res.json();

      setProducts(prev =>
        isEdit
          ? prev.map(p => (p.productId === saved.productId ? saved : p))
          : [...prev, saved]
      );

      closeModal();
    } catch (err) {
      console.error(err);
      alert("Error saving product. Make sure all fields are filled correctly.");
    }
  }

  async function confirmDelete() {
    if (!user?.token || !deletingProduct) return;

    try {
      const res = await fetch(`${API_URL}/${deletingProduct.productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Failed to delete product");

      setProducts(prev => prev.filter(p => p.productId !== deletingProduct.productId));
      closeDeleteModal();
    } catch (err) {
      console.error(err);
      alert("Error deleting product.");
    }
  }

  return (
    <div className="p-6 font-lexend">
      <h1 className="text-[48px] font-extrabold mb-4 text-black font-nunito uppercase">
        Product List
      </h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-64"
        />
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#4C763B] text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Base Price</th>
              <th className="p-3 text-left">List Price</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-600">
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.productId} className="border-t">
                  <td className="p-3">{product.productName}</td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3">₱{product.basePrice?.toFixed(2)}</td>
                  <td className="p-3">₱{product.listPrice?.toFixed(2)}</td>
                  <td className="p-3">
                    {categories.find(c => c.categoryId === product.categoryId)?.categoryName || "-"}
                  </td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => openEditModal(product)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Modal */}
      {modalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-[#4C763B]">
              {editingProduct.productId ? "Edit Product" : "Add Product"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="font-medium">Name</label>
                <input
                  type="text"
                  value={editingProduct.productName}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, productName: e.target.value })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="font-medium">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  rows={4}
                  className="w-full border rounded px-3 py-2 resize-none"
                />
              </div>

              <div>
                <label className="font-medium">Base Price</label>
                <input
                  type="number"
                  value={editingProduct.basePrice}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, basePrice: parseFloat(e.target.value) })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="font-medium">List Price</label>
                <input
                  type="number"
                  value={editingProduct.listPrice}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, listPrice: parseFloat(e.target.value) })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="font-medium">Category</label>
                <select
                  value={editingProduct.categoryId || ""}
                  onChange={e =>
                    setEditingProduct({ ...editingProduct, categoryId: parseInt(e.target.value) })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
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
      {deleteModalOpen && deletingProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-bold">{deletingProduct.productName}</span>? This action cannot be undone.
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