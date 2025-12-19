import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:8080/api/categories";

export default function Categories() {
  const { user } = useAuth();

  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  /* =====================
     Fetch categories
     ===================== */
  useEffect(() => {
    if (!user?.token) return;

    fetch(API_URL, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        return res.json();
      })
      .then(setCategories)
      .catch(console.error);
  }, [user]);

  const filteredCategories = categories.filter(c =>
    c.categoryName.toLowerCase().includes(search.toLowerCase())
  );

  function openAddModal() {
    setEditingCategory({ categoryName: "", description: "" });
    setModalOpen(true);
  }

  function openEditModal(category) {
    setEditingCategory({ ...category });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingCategory(null);
  }

  /* =====================
     Create / Update
     ===================== */
  async function handleSave(e) {
    e.preventDefault();
    if (!user?.token || !editingCategory) return;

    const isEdit = Boolean(editingCategory.categoryId);
    const url = isEdit
      ? `${API_URL}/${editingCategory.categoryId}`
      : API_URL;

    try {
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editingCategory),
      });

      if (!res.ok) throw new Error("Failed to save category");

      const saved = await res.json();

      setCategories(prev =>
        isEdit
          ? prev.map(c =>
              c.categoryId === saved.categoryId ? saved : c
            )
          : [...prev, saved]
      );

      closeModal();
    } catch (err) {
      console.error(err);
    }
  }

  /* =====================
     Delete
     ===================== */
  async function handleDelete(categoryId) {
    if (!user?.token) return;

    try {
      const res = await fetch(`${API_URL}/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      setCategories(prev =>
        prev.filter(c => c.categoryId !== categoryId)
      );
    } catch (err) {
      console.error(err);
    }
  }

  /* =====================
     Render
     ===================== */
  return (
    <div className="p-6 font-lexend">
      <h1 className="text-[48px] font-extrabold mb-4 text-black font-nunito uppercase">
        Category List
      </h1>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 border rounded w-64"
        />
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#4C763B] text-white">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-4 text-gray-600">
                  No categories found.
                </td>
              </tr>
            ) : (
              filteredCategories.map(category => (
                <tr key={category.categoryId} className="border-t">
                  <td className="p-3">{category.categoryName}</td>
                  <td className="p-3">{category.description}</td>
                  <td className="p-3 flex justify-center space-x-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.categoryId)}
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

      {modalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-[#4C763B]">
              {editingCategory.categoryId ? "Edit Category" : "Add Category"}
            </h2>

            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="font-medium">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.categoryName}
                  onChange={e =>
                    setEditingCategory({
                      ...editingCategory,
                      categoryName: e.target.value,
                    })
                  }
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="font-medium">Description</label>
                <textarea
                  value={editingCategory.description}
                  onChange={e =>
                    setEditingCategory({
                      ...editingCategory,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  required
                  className="w-full border rounded px-3 py-2 resize-none"
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
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
