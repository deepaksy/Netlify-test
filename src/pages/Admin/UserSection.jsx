import React, { useEffect, useState } from "react";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getSubscriptionNames,
} from "../../services/AdminService";

const UserSection = () => {
  const [users, setUsers] = useState([]);
  const [subscriptionNames, setSubscriptionNames] = useState([]);
  const [editing, setEditing] = useState(null);
  const [uid, setUid] = useState(0);
  const [form, setForm] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    gender: "",
    subscriptionType: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, subscriptions] = await Promise.all([
          getUsers(),
          getSubscriptionNames(),
        ]);
        setUsers(usersData);
        setSubscriptionNames(subscriptions);
      } catch (error) {
        
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        address: form.address,
        mobile: form.mobile,
        gender: form.gender.toUpperCase(),
        subscriptionType: form.subscriptionType,
      };
      if (!editing || (editing !== null && form.password.trim() !== "")) {
        payload.password = form.password;
      }
      if (editing !== null) {
        await updateUser(uid, payload);
        setEditing(null);
      } else {
        await addUser(payload);
      }
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      setForm({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        mobile: "",
        address: "",
        gender: "",
        subscriptionType: "",
      });
    } catch (error) {
      }
  };

  const handleEdit = (idx) => {
    const user = users[idx];
    let normalizedGender = "";
    if (user.gender) {
      normalizedGender =
        user.gender.charAt(0).toUpperCase() + user.gender.slice(1).toLowerCase();
    }
    setForm({
      ...user,
      gender: normalizedGender,
      password: "",
    });
    setUid(user.id);
    setEditing(idx);
  };

  const handleDelete = async (idx) => {
    try {
      const userId = users[idx].id;
      await deleteUser(userId);
      const updatedUsers = await getUsers();
      setUsers(updatedUsers);
      if (editing === idx) setEditing(null);
    } catch (error) {
      }
  };

  const handleCancelEdit = () => {
    setEditing(null);
    setForm({
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      mobile: "",
      address: "",
      gender: "",
      subscriptionType: "",
    });
  };

  return (
    <div className="container my-5">
      <div
        className="mx-auto p-4 bg-white shadow rounded-4"
        style={{ maxWidth: 930 }}
      >
        <h2 className="text-center fw-bold mb-4">Manage Users</h2>
        <form className="row g-3 mb-4" onSubmit={handleSubmit}>
          <div className="col-sm-6 col-md-4">
            <label className="form-label fw-semibold">First Name</label>
            <input
              name="firstName"
              className="form-control"
              value={form.firstName}
              onChange={handleChange}
              required
              placeholder="First Name"
            />
          </div>
          <div className="col-sm-6 col-md-4">
            <label className="form-label fw-semibold">Last Name</label>
            <input
              name="lastName"
              className="form-control"
              value={form.lastName}
              onChange={handleChange}
              required
              placeholder="Last Name"
            />
          </div>
          <div className="col-sm-6 col-md-4">
            <label className="form-label fw-semibold">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Email"
            />
          </div>
          <div className="col-sm-6 col-md-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required={editing === null}
              placeholder={editing !== null ? "Leave blank to keep unchanged" : "Password"}
            />
          </div>
          <div className="col-sm-6 col-md-4">
            <label className="form-label fw-semibold">Mobile</label>
            <input
              name="mobile"
              className="form-control"
              value={form.mobile}
              onChange={handleChange}
              required
              placeholder="Mobile"
            />
          </div>
          <div className="col-sm-6 col-md-4">
            <label className="form-label fw-semibold">Address</label>
            <input
              name="address"
              className="form-control"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="Address"
            />
          </div>
          <div className="col-sm-6 col-md-4">
            <label className="form-label fw-semibold">Gender</label>
            <div>
              {["Male", "Female", "Other"].map((g) => (
                <div className="form-check form-check-inline" key={g}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id={`gender-${g}`}
                    value={g}
                    checked={form.gender === g}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-check-label" htmlFor={`gender-${g}`}>
                    {g}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-sm-6 col-md-4">
            <label className="form-label fw-semibold">Subscription Type</label>
            <select
              name="subscriptionType"
              className="form-select"
              value={form.subscriptionType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select subscription type
              </option>
              {subscriptionNames.length === 0 ? (
                <option>Loading...</option>
              ) : (
                subscriptionNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-primary fw-semibold">
              {editing !== null ? "Update" : "Add"} User
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

        <div className="table-responsive rounded-4 shadow-sm bg-light">
          <table className="table align-middle">
            <thead className="table-primary text-white">
              <tr>
                <th>Id</th>
                <th>First</th>
                <th>Last</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Gender</th>
                <th>Subscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 fst-italic text-secondary bg-white">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.mobile}</td>
                    <td>{user.address}</td>
                    <td>{user.gender}</td>
                    <td>{user.subscriptionType}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-info me-2 fw-semibold text-white"
                        onClick={() => handleEdit(i)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger fw-semibold"
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
      </div>
    </div>
  );
};

export default UserSection;
