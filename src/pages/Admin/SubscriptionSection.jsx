import React, { useState, useEffect } from "react";
import {
  addSubscription,
  getSubscriptions,
  deleteSubscription,
  updateSubscription,
} from "../../services/AdminService";

const normalizeBoolean = (val) => {
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val === 1;
  if (typeof val === "string") {
    const v = val.trim().toLowerCase();
    return v === "true" || v === "yes" || v === "1";
  }
  return false;
};

const initialFormState = {
  id: "",
  name: "",
  description: "",
  access: "OFF_PEAK_HOURS",
  dietConsultation: false,
  sauna: false,
  duration: "1",
  price: "",
  discount: "0",
};

const durations = Array.from({ length: 12 }, (_, i) => `${i+1}`);

const SubscriptionSection = () => {
  const [packs, setPacks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialFormState);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadSubscriptions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getSubscriptions();
      if (response.status === 204) {
        setPacks([]);
      } else {
        const normalizedData = response.data.map((sub) => ({
          ...sub,
          dietConsultation: normalizeBoolean(sub.dietConsultation),
          sauna: normalizeBoolean(sub.sauna),
        }));
        setPacks(normalizedData);
      }
    } catch (err) {
      setError(
        "Failed to fetch subscriptions: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const boolToString = (val) => (val ? "true" : "false");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if ((name === "sauna" || name === "dietConsultation") && type === "radio") {
      setForm((prev) => ({
        ...prev,
        [name]: value === "true",
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEdit = (idx) => {
    const sub = packs[idx];
    setEditing(idx);
    setForm({
      ...sub,
      dietConsultation: normalizeBoolean(sub.dietConsultation),
      sauna: normalizeBoolean(sub.sauna),
      duration: String(sub.duration),
      price: String(sub.price),
      discount: String(sub.discount)
    });
  };

  const handleDelete = async (idx) => {
    const subToDelete = packs[idx];
    if (!window.confirm(`Are you sure you want to delete package "${subToDelete.name}"?`)) {
      return;
    }
    setStatus(null);
    try {
      await deleteSubscription(subToDelete.id);
      setStatus("Package deleted successfully!");
      if (editing === idx) {
        setEditing(null);
        setForm(initialFormState);
      }
      await loadSubscriptions();
    } catch (err) {
      setStatus(
        "Error deleting package: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const finalFormData = {
      ...form,
      dietConsultation: Boolean(form.dietConsultation),
      sauna: Boolean(form.sauna),
    };

    try {
      if (editing !== null) {
        await updateSubscription(form.id, finalFormData);
        setStatus("Package updated successfully!");
      } else {
        const { id, ...postData } = finalFormData;
        await addSubscription(postData);
        setStatus("Package added successfully!");
      }
      setEditing(null);
      setForm(initialFormState);
      await loadSubscriptions();
    } catch (err) {
      setStatus(
        (editing !== null ? "Error updating package: " : "Error adding package: ") +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(initialFormState);
  };

  return (
    <div className="container my-5">
      <div className="mx-auto p-4 bg-white rounded-4 shadow" style={{maxWidth: 1080}}>
        <h2 className="fw-bold text-center mb-4">Manage Subscriptions</h2>
        {loading && <div className="text-center text-secondary mb-3">Loading subscriptions...</div>}
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {status && !error && (
          <div className={`alert py-2 mb-3 ${status.startsWith("Error") ? "alert-danger" : "alert-success"}`}>{status}</div>
        )}
        {!loading && (
          <>
            <form className="row g-3 mb-4" onSubmit={handleSubmit}>
              {editing !== null && (
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Id</label>
                  <input
                    name="id"
                    className="form-control"
                    value={form.id}
                    readOnly
                  />
                </div>
              )}
              <div className="col-md-4 col-lg-3">
                <label className="form-label fw-semibold">Package Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Gold"
                />
              </div>
              <div className="col-md-8 col-lg-4">
                <label className="form-label fw-semibold">Description</label>
                <input
                  name="description"
                  className="form-control"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Full time, Spa, Diet"
                />
              </div>
              <div className="col-md-4 col-lg-2">
                <label className="form-label fw-semibold">Gym Access</label>
                <select
                  className="form-select"
                  name="access"
                  value={form.access}
                  onChange={handleChange}
                  required
                >
                  <option value="OFF_PEAK_HOURS">Off-peak hours</option>
                  <option value="FULLTIME">Full Time</option>
                </select>
              </div>

              <div className="col-6 col-md-4 col-lg-2">
                <label className="form-label fw-semibold">Diet Consultation</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="dietConsultation"
                      id="diet-yes"
                      value="true"
                      checked={boolToString(form.dietConsultation) === "true"}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="diet-yes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="dietConsultation"
                      id="diet-no"
                      value="false"
                      checked={boolToString(form.dietConsultation) === "false"}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="diet-no">
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <label className="form-label fw-semibold">Sauna Access</label>
                <div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sauna"
                      id="sauna-yes"
                      value="true"
                      checked={boolToString(form.sauna) === "true"}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="sauna-yes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="sauna"
                      id="sauna-no"
                      value="false"
                      checked={boolToString(form.sauna) === "false"}
                      onChange={handleChange}
                      required
                    />
                    <label className="form-check-label" htmlFor="sauna-no">
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <label className="form-label fw-semibold">Duration (months)</label>
                <select
                  name="duration"
                  className="form-select"
                  value={form.duration}
                  onChange={handleChange}
                  required
                >
                  {durations.map((dur) => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <label className="form-label fw-semibold">Price</label>
                <input
                  name="price"
                  className="form-control"
                  type="number"
                  min="0"
                  step="any"
                  value={form.price}
                  onChange={handleChange}
                  required
                  placeholder="₹"
                />
              </div>
              <div className="col-6 col-md-4 col-lg-2">
                <label className="form-label fw-semibold">Discount (%)</label>
                <input
                  name="discount"
                  className="form-control"
                  type="number"
                  min="0"
                  max="99"
                  value={form.discount}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 d-flex gap-2">
                <button type="submit" className="btn btn-primary fw-semibold">
                  {editing !== null ? "Update" : "Add"} Package
                </button>
                {editing !== null && (
                  <button
                    type="button"
                    className="btn btn-secondary fw-semibold"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="table-responsive rounded-4 shadow-sm bg-light">
              <table className="table align-middle mb-0">
                <thead className="table-primary text-white">
                  <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Gym Access</th>
                    <th>Diet</th>
                    <th>Sauna</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Discount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packs.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center fst-italic py-4 text-secondary bg-white">
                        No packages found.
                      </td>
                    </tr>
                  ) : (
                    packs.map((p, i) => (
                      <tr key={i}>
                        <td>{p.id}</td>
                        <td>{p.name}</td>
                        <td style={{ whiteSpace: "pre-wrap" }}>{p.description}</td>
                        <td>{p.access === "FULLTIME" ? "Full Time" : "Off-peak hours"}</td>
                        <td>
                          {normalizeBoolean(p.dietConsultation)
                            ? <span className="badge bg-success">Yes</span>
                            : <span className="badge bg-danger">No</span>}
                        </td>
                        <td>
                          {normalizeBoolean(p.sauna)
                            ? <span className="badge bg-success">Yes</span>
                            : <span className="badge bg-danger">No</span>}
                        </td>
                        <td>{p.duration}</td>
                        <td>₹{p.price}</td>
                        <td>{p.discount}%</td>
                        <td>
                          <button
                            className="btn btn-info btn-sm fw-semibold text-white me-2"
                            onClick={() => handleEdit(i)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm fw-semibold"
                            onClick={() => handleDelete(i)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSection;
