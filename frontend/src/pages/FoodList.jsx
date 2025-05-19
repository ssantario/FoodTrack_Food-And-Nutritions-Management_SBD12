import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [addData, setAddData] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFoods() {
      try {
        const res = await axios.get("/api/foods");
        setFoods(res.data);
      } catch (err) {
        setError("Gagal memuat data makanan.");
      } finally {
        setLoading(false);
      }
    }
    fetchFoods();
  }, []);

  const handleEdit = (food) => {
    setEditId(food.id);
    setEditData({
      name: food.name || "",
      calories: food.calories || "",
      protein: food.protein || "",
      carbs: food.carbs || "",
      fat: food.fat || ""
    });
    setEditError(null);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditData({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    setEditError(null);
  };

  const handleEditSave = async (id) => {
    setEditLoading(true);
    setEditError(null);
    try {
      await axios.patch(`/api/foods/${id}`, {
        name: editData.name,
        calories: editData.calories,
        protein: editData.protein,
        carbs: editData.carbs,
        fat: editData.fat
      });
      setFoods((prev) => prev.map(f => f.id === id ? { ...f, ...editData } : f));
      setEditId(null);
      setEditData({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    } catch (err) {
      setEditError("Gagal menyimpan perubahan.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddChange = (e) => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    setAddSuccess(null);
    try {
      const res = await axios.post("/api/foods", {
        name: addData.name,
        calories: addData.calories,
        protein: addData.protein,
        carbs: addData.carbs,
        fat: addData.fat
      });
      setFoods((prev) => [res.data, ...prev]);
      setAddSuccess("Makanan berhasil ditambahkan!");
      setAddData({ name: "", calories: "", protein: "", carbs: "", fat: "" });
    } catch (err) {
      setAddError("Gagal menambah makanan.");
    } finally {
      setAddLoading(false);
    }
  };

  const openDeleteModal = (food) => {
    setFoodToDelete(food);
    setShowDeleteModal(true);
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setFoodToDelete(null);
    setDeleteError(null);
  };

  const handleDeleteConfirmed = async () => {
    if (!foodToDelete) return;
    setDeleteLoading(foodToDelete.id);
    setDeleteError(null);
    try {
      await axios.delete(`/api/foods/${foodToDelete.id}`);
      setFoods((prev) => prev.filter(f => f.id !== foodToDelete.id));
      closeDeleteModal();
    } catch (err) {
      setDeleteError("Gagal menghapus makanan.");
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e8f5e9] to-[#c8e6c9] p-3 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4 text-main text-center drop-shadow-sm">Manajemen Makanan</h1>
        <p className="text-slate-600 text-center mb-6 md:mb-8 text-base md:text-lg">Tambah, lihat, dan edit makanan favoritmu untuk kebutuhan nutrisi harian.</p>
        {/* Add Food Section */}
        <div className="mb-6">
          <form onSubmit={handleAddFood} className="bg-white/90 rounded-2xl shadow-lg p-3 md:p-4 flex flex-col gap-2 md:gap-3 border border-main/10">
            <h2 className="text-lg md:text-xl font-semibold text-main mb-2">Tambah Makanan Baru</h2>
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              <input
                name="name"
                type="text"
                placeholder="Nama Makanan"
                className="flex-1 border border-main/30 focus:border-main rounded px-2 py-2 text-sm md:text-base bg-main/5 focus:bg-white transition"
                value={addData.name}
                onChange={handleAddChange}
                required
                disabled={addLoading}
              />
              <input
                name="calories"
                type="number"
                placeholder="Kalori"
                className="w-24 border border-main/30 focus:border-main rounded px-2 py-2 text-sm md:text-base bg-main/5 focus:bg-white transition"
                value={addData.calories}
                onChange={handleAddChange}
                disabled={addLoading}
              />
              <input
                name="protein"
                type="number"
                placeholder="Protein"
                className="w-24 border border-main/30 focus:border-main rounded px-2 py-2 text-sm md:text-base bg-main/5 focus:bg-white transition"
                value={addData.protein}
                onChange={handleAddChange}
                disabled={addLoading}
              />
              <input
                name="fat"
                type="number"
                placeholder="Lemak"
                className="w-24 border border-main/30 focus:border-main rounded px-2 py-2 text-sm md:text-base bg-main/5 focus:bg-white transition"
                value={addData.fat}
                onChange={handleAddChange}
                disabled={addLoading}
              />
              <input
                name="carbs"
                type="number"
                placeholder="Karbo"
                className="w-24 border border-main/30 focus:border-main rounded px-2 py-2 text-sm md:text-base bg-main/5 focus:bg-white transition"
                value={addData.carbs}
                onChange={handleAddChange}
                disabled={addLoading}
              />
            </div>
            <button
              type="submit"
              className="bg-main hover:bg-secondary text-white px-4 py-2 rounded mt-1 w-full md:w-auto md:self-end font-semibold shadow transition disabled:opacity-60"
              disabled={addLoading}
            >
              {addLoading ? "Menyimpan..." : "Tambah Makanan"}
            </button>
            {addError && <div className="text-red-500 text-sm mt-1">{addError}</div>}
            {addSuccess && <div className="text-green-600 text-sm mt-1">{addSuccess}</div>}
          </form>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <span className="block w-8 h-1 rounded bg-main/30" />
          <h2 className="text-lg md:text-xl font-semibold text-main flex-1 text-center">Daftar Makanan</h2>
          <span className="block w-8 h-1 rounded bg-main/30" />
        </div>
      </div>
      {/* Food List */}
      {loading ? (
        <div className="text-base md:text-lg text-gray-600 mt-8">Memuat data makanan...</div>
      ) : error ? (
        <div className="text-red-500 mt-8">{error}</div>
      ) : (
        <>
          {/* Mobile: Card List */}
          <div className="flex flex-col gap-4 w-full md:hidden max-w-2xl">
            {foods.map(food => (
              <div key={food.id} className="bg-white/90 rounded-xl shadow-lg p-4 border border-main/10 flex flex-col gap-2 transition hover:shadow-xl">
                {editId === food.id ? (
                  <>
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                      className="border border-main/30 focus:border-main rounded px-2 py-2 w-full mb-1 text-base bg-main/5 focus:bg-white transition"
                      disabled={editLoading}
                      placeholder="Nama"
                    />
                    <div className="flex gap-2">
                      <input
                        name="calories"
                        type="number"
                        value={editData.calories}
                        onChange={handleEditChange}
                        className="border border-main/30 focus:border-main rounded px-2 py-2 w-full text-base bg-main/5 focus:bg-white transition"
                        disabled={editLoading}
                        placeholder="Kalori"
                      />
                      <input
                        name="protein"
                        type="number"
                        value={editData.protein}
                        onChange={handleEditChange}
                        className="border border-main/30 focus:border-main rounded px-2 py-2 w-full text-base bg-main/5 focus:bg-white transition"
                        disabled={editLoading}
                        placeholder="Protein"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        name="fat"
                        type="number"
                        value={editData.fat}
                        onChange={handleEditChange}
                        className="border border-main/30 focus:border-main rounded px-2 py-2 w-full text-base bg-main/5 focus:bg-white transition"
                        disabled={editLoading}
                        placeholder="Lemak"
                      />
                      <input
                        name="carbs"
                        type="number"
                        value={editData.carbs}
                        onChange={handleEditChange}
                        className="border border-main/30 focus:border-main rounded px-2 py-2 w-full text-base bg-main/5 focus:bg-white transition"
                        disabled={editLoading}
                        placeholder="Karbo"
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded flex-1 font-semibold shadow disabled:opacity-60 transition"
                        onClick={() => handleEditSave(food.id)}
                        disabled={editLoading}
                      >
                        Simpan
                      </button>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded flex-1 font-semibold shadow"
                        onClick={handleEditCancel}
                        disabled={editLoading}
                      >
                        Batal
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex-1 font-semibold shadow transition"
                        onClick={() => openDeleteModal(food)}
                        disabled={deleteLoading === food.id}
                      >
                        {deleteLoading === food.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                    {editId === food.id && editError && (
                      <div className="text-red-500 text-xs mt-1">{editError}</div>
                    )}
                    {deleteError && <div className="text-red-500 text-xs mt-1">{deleteError}</div>}
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-main text-lg mb-1">{food.name}</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                      <span>Kalori: <span className="font-medium text-slate-700">{food.calories}</span></span>
                      <span>Protein: <span className="font-medium text-slate-700">{food.protein}</span></span>
                      <span>Lemak: <span className="font-medium text-slate-700">{food.fat}</span></span>
                      <span>Karbo: <span className="font-medium text-slate-700">{food.carbs}</span></span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-main hover:bg-secondary text-white px-3 py-2 rounded flex-1 font-semibold shadow transition"
                        onClick={() => handleEdit(food)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex-1 font-semibold shadow transition"
                        onClick={() => openDeleteModal(food)}
                        disabled={deleteLoading === food.id}
                      >
                        {deleteLoading === food.id ? "Menghapus..." : "Hapus"}
                      </button>
                    </div>
                    {deleteError && <div className="text-red-500 text-xs mt-1">{deleteError}</div>}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Desktop: Table */}
          <div className="w-full max-w-2xl bg-white/90 rounded-2xl shadow-xl p-2 md:p-6 border border-main/10 overflow-x-auto hidden md:block">
            <table className="w-full min-w-[600px] text-left border-collapse text-xs md:text-base">
              <thead>
                <tr className="bg-main/10">
                  <th className="py-2 md:py-3 px-2 md:px-4 rounded-tl-2xl">Nama</th>
                  <th className="py-2 md:py-3 px-2 md:px-4">Kalori</th>
                  <th className="py-2 md:py-3 px-2 md:px-4">Protein</th>
                  <th className="py-2 md:py-3 px-2 md:px-4">Lemak</th>
                  <th className="py-2 md:py-3 px-2 md:px-4">Karbo</th>
                  <th className="py-2 md:py-3 px-2 md:px-4 rounded-tr-2xl text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {foods.map(food => (
                  <tr key={food.id} className="border-b last:border-b-0 hover:bg-main/5 transition">
                    <td className="py-3 px-4 font-semibold text-main">
                      {editId === food.id ? (
                        <input
                          name="name"
                          value={editData.name}
                          onChange={handleEditChange}
                          className="border border-main/30 focus:border-main rounded px-2 py-2 w-full text-base bg-main/5 focus:bg-white transition"
                          disabled={editLoading}
                        />
                      ) : (
                        food.name
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editId === food.id ? (
                        <input
                          name="calories"
                          type="number"
                          value={editData.calories}
                          onChange={handleEditChange}
                          className="border border-main/30 focus:border-main rounded px-2 py-2 w-full text-base bg-main/5 focus:bg-white transition"
                          disabled={editLoading}
                        />
                      ) : (
                        food.calories
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editId === food.id ? (
                        <input
                          name="protein"
                          type="number"
                          value={editData.protein}
                          onChange={handleEditChange}
                          className="border border-main/30 focus:border-main rounded px-2 py-2 w-full text-base bg-main/5 focus:bg-white transition"
                          disabled={editLoading}
                        />
                      ) : (
                        food.protein
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editId === food.id ? (
                        <input
                          name="fat"
                          type="number"
                          value={editData.fat}
                          onChange={handleEditChange}
                          className="border border-main/30 focus:border-main rounded px-2 py-2 w-full text-base bg-main/5 focus:bg-white transition"
                          disabled={editLoading}
                        />
                      ) : (
                        food.fat
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {editId === food.id ? (
                        <input
                          name="carbs"
                          type="number"
                          value={editData.carbs}
                          onChange={handleEditChange}
                          className="border border-main/30 focus:border-main rounded px-2 py-2 w-full text-base bg-main/5 focus:bg-white transition"
                          disabled={editLoading}
                        />
                      ) : (
                        food.carbs
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {editId === food.id ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-semibold shadow disabled:opacity-60 transition"
                            onClick={() => handleEditSave(food.id)}
                            disabled={editLoading}
                          >
                            Simpan
                          </button>
                          <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded font-semibold shadow"
                            onClick={handleEditCancel}
                            disabled={editLoading}
                          >
                            Batal
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded font-semibold shadow disabled:opacity-60 transition"
                            onClick={() => openDeleteModal(food)}
                            disabled={deleteLoading === food.id}
                          >
                            {deleteLoading === food.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button
                            className="bg-main hover:bg-secondary text-white px-3 py-2 rounded font-semibold shadow transition"
                            onClick={() => handleEdit(food)}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded font-semibold shadow transition"
                            onClick={() => openDeleteModal(food)}
                            disabled={deleteLoading === food.id}
                          >
                            {deleteLoading === food.id ? "Menghapus..." : "Hapus"}
                          </button>
                        </div>
                      )}
                    {deleteError && <div className="text-red-500 text-xs mt-1">{deleteError}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 max-w-sm border border-main/20 animate-fade-in">
            <h3 className="text-lg font-semibold text-main mb-2">Konfirmasi Hapus</h3>
            <p className="mb-4 text-slate-700">Yakin ingin menghapus makanan <span className="font-bold text-main">{foodToDelete?.name}</span>?</p>
            {deleteError && <div className="text-red-500 text-sm mb-2">{deleteError}</div>}
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition disabled:opacity-60"
                onClick={handleDeleteConfirmed}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => navigate("/dashboard")}
        className="fixed top-5 left-5 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-main flex items-center justify-center shadow-lg hover:bg-secondary focus:bg-secondary transition-colors duration-200 outline-none focus:ring-4 focus:ring-main/30 group"
        aria-label="Home"
      >
        <svg className="w-6 h-6 md:w-7 md:h-7 text-white group-hover:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
        </svg>
      </button>
    </div>
  );
}
