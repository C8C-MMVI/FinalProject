import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080/api/suppliers";

export default function Suppliers() {
  const { user } = useAuth();

  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);

  useEffect(() => {
    if (!user?.token) return;

    fetch(API_URL, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch suppliers");
        return res.json();
      })
      .then(setSuppliers)
      .catch(console.error);
  }, [user]);

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  function openAddModal() {
    setEditingSupplier({ name: "", contactInfo: "", address: "" });
    setModalOpen(true);
  }

  function openEditModal(supplier) {
    setEditingSupplier({ ...supplier });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingSupplier(null);
  }

  function openDeleteModal(supplier) {
    setDeletingSupplier(supplier);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setDeletingSupplier(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!user?.token || !editingSupplier) return;

    const isEdit = Boolean(editingSupplier.supplierId);
    const url = isEdit
      ? `${API_URL}/${editingSupplier.supplierId}`
      : API_URL;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editingSupplier),
      });

      if (!res.ok) throw new Error("Failed to save supplier");

      const saved = await res.json();

      setSuppliers(prev =>
        isEdit
          ? prev.map(s => (s.supplierId === saved.supplierId ? saved : s))
          : [...prev, saved]
      );

      closeModal();
    } catch (err) {
      console.error(err);
    }
  }

  async function confirmDelete() {
    if (!user?.token || !deletingSupplier) return;

    try {
      const res = await fetch(`${API_URL}/${deletingSupplier.supplierId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Failed to delete supplier");

      setSuppliers(prev => prev.filter(s => s.supplierId !== deletingSupplier.supplierId));
      closeDeleteModal();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="p-6 font-lexend">
      <h1 className="text-[48px] font-extrabold mb-4 text-black font-nunito uppercase">
        Supplier List
      </h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-64"
        />
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Supplier
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#4C763B] text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-600">
                  No suppliers found.
                </td>
              </tr>
            ) : (
              filteredSuppliers.map(supplier => (
                <tr key={supplier.supplierId} className="border-t">
                  <td className="p-3">{supplier.name}</td>
                  <td className="p-3">{supplier.contactInfo}</td>
                  <td className="p-3">{supplier.address}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => openEditModal(supplier)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDeleteModal(supplier)}
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
      {modalOpen && editingSupplier && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-[#4C763B]">
              {editingSupplier.supplierId ? "Edit Supplier" : "Add Supplier"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="font-medium">Name</label>
                <input
                  type="text"
                  value={editingSupplier.name}
                  onChange={e =>
                    setEditingSupplier({ ...editingSupplier, name: e.target.value })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="font-medium">Contact</label>
                <input
                  type="text"
                  value={editingSupplier.contactInfo}
                  onChange={e =>
                    setEditingSupplier({ ...editingSupplier, contactInfo: e.target.value })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="font-medium">Address</label>
                <input
                  type="text"
                  value={editingSupplier.address}
                  onChange={e =>
                    setEditingSupplier({ ...editingSupplier, address: e.target.value })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                />
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
      {deleteModalOpen && deletingSupplier && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete supplier{" "}
              <span className="font-bold">{deletingSupplier.name}</span>? This action cannot be undone.
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