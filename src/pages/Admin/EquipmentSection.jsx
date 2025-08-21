import React, { useState, useEffect } from "react";
import {
  addEquipment,
  getAllEquipments,
  deleteEquipment,
  updateEquipment,
  toggleEquipmentMaintenance,
} from "../../services/AdminService";

const CATEGORY_OPTIONS = [
  "CARDIO",
  "STRENGTH",
  "FLEXIBILITY",
  "FREE_WEIGHTS",
  "RESISTANCE_MACHINES",
];

const EquipmentSection = () => {
  const [emps, setEmps] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEquipment();
    // eslint-disable-next-line
  }, []);

  const fetchEquipment = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getAllEquipments();
      setEmps(data);
    } catch (err) {
      setError("Could not load equipment list.");
    }
    setLoading(false);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (editing !== null) {
        const { id, ...dto } = form;
        await updateEquipment(id, dto);
        await fetchEquipment();
        setEditing(null);
      } else {
        await addEquipment(form);
        await fetchEquipment();
      }
      setForm({
        id: "",
        name: "",
        description: "",
        price: "",
        category: "",
      });
    } catch (err) {
      setError(
        "Failed to " +
          (editing !== null ? "update" : "add") +
          " equipment: " +
          (err?.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  const handleEdit = (idx) => {
    setEditing(idx);
    setForm({
      id: emps[idx].id ?? "",
      name: emps[idx].name ?? "",
      description: emps[idx].description ?? "",
      price: emps[idx].price ?? "",
      category: emps[idx].category ?? "",
    });
  };

  const handleDelete = async (idx) => {
    setError("");
    setLoading(true);
    try {
      const equipment = emps[idx];
      if (!equipment.id) {
        setError("Cannot determine equipment ID for deletion.");
        setLoading(false);
        return;
      }
      await deleteEquipment(equipment.id);
      await fetchEquipment();
      if (editing === idx) setEditing(null);
    } catch (err) {
      setError(
        "Failed to delete equipment: " +
          (err?.response?.data?.message || err.message)
      );
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setForm({
      id: "",
      name: "",
      description: "",
      price: "",
      category: "",
    });
  };

  const handleToggleMaintenance = async (idx) => {
    const equipment = emps[idx];
    if (!equipment?.id) return;
    setError("");
    setMaintenanceLoading((prev) => ({ ...prev, [equipment.id]: true }));
    try {
      await toggleEquipmentMaintenance(equipment.id, equipment.forMaintenance);
      await fetchEquipment();
    } catch (err) {
      setError(
        "Failed to update maintenance status: " +
          (err?.response?.data?.message || err.message)
      );
    }
    setMaintenanceLoading((prev) => ({ ...prev, [equipment.id]: false }));
  };

  return (
    <div className="container my-5">
      <div className="mx-auto p-4 bg-white rounded-4 shadow" style={{ maxWidth: 900 }}>
        <h2 className="fw-bold text-center mb-4">Manage Equipment</h2>

        <form className="row g-3 mb-4" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Equipment Name</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Name"
            />
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Description</label>
            <input
              name="description"
              className="form-control"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Description"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Price</label>
            <input
              name="price"
              className="form-control"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
              placeholder="₹"
            />
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Category</label>
            <select
              name="category"
              className="form-select"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-primary fw-semibold" disabled={loading}>
              {loading
                ? "Saving..."
                : editing !== null
                ? "Update"
                : "Add"} Equipment
            </button>
            {editing !== null && (
              <button
                type="button"
                className="btn btn-secondary fw-semibold"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {error && (
          <div className="alert alert-danger py-2 mb-3">{error}</div>
        )}

        <div className="table-responsive rounded-4 shadow-sm bg-light">
          <table className="table align-middle mb-0">
            <thead className="table-primary text-white">
              <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Maintenance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center fst-italic py-4 text-secondary bg-white">
                    No equipment found.
                  </td>
                </tr>
              ) : (
                emps.map((e, i) => (
                  <tr key={e.id ?? i}>
                    <td>{e.id}</td>
                    <td>{e.name}</td>
                    <td>{e.description}</td>
                    <td>₹{e.price}</td>
                    <td>
                      {e.category ? e.category.toString().replace(/_/g, " ") : ""}
                    </td>
                    <td>
                      <button
                        className={
                          "btn btn-sm fw-semibold " +
                          (e.forMaintenance ? "btn-warning" : "btn-outline-secondary")
                        }
                        onClick={() => handleToggleMaintenance(i)}
                        disabled={maintenanceLoading[e.id]}
                        title={e.forMaintenance ? "Unmark Maintenance" : "Mark for Maintenance"}
                      >
                        {maintenanceLoading[e.id]
                          ? "Updating..."
                          : e.forMaintenance
                          ? "Marked"
                          : "Available"}
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2 fw-semibold text-white"
                        onClick={() => handleEdit(i)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm fw-semibold"
                        onClick={() => handleDelete(i)}
                        disabled={loading}
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
      </div>
    </div>
  );
};

export default EquipmentSection;
