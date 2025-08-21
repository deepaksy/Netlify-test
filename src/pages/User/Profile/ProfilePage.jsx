import React, { useState, useEffect } from "react";
import {
  FaUserEdit, FaSave, FaUser, FaEnvelope, FaPhone, FaHome,
  FaVenusMars, FaCamera, FaTrash, FaHeartbeat, FaFlag, FaChild, FaWeight
} from "react-icons/fa";
import './ProfilePage.css';
import { UserService } from "../../../services/UserService";
import { jwtDecode } from "jwt-decode";

const GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" }
];

function getCurrentUserId() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.sub || decoded.email || null;
  } catch {
    return null;
  }
}

// Helper: BMI calculation
function calculateBMI(height, weight) {
  if (!height || !weight) return "";
  const heightM = height / 100;
  return (weight / (heightM * heightM)).toFixed(2);
}

const ProfilePage = () => {
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [fileInput, setFileInput] = useState(null);

  const userId = getCurrentUserId();

  const fetchProfile = async () => {
    setLoading(true);
    setApiError("");
    try {
      if (!userId) throw new Error("Missing user id");
      const res = await UserService.fetchProfile();
      setForm(res.data);
      setLoading(false);
    } catch {
      setApiError("Failed to load profile.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setApiError("You must be logged in to view your profile.");
      setLoading(false);
      return;
    }
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEdit = (e) => { e.preventDefault(); setEditing(true); setSuccessMsg(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(""); setSuccessMsg("");
    try {
      await UserService.updateProfile(form);
      setEditing(false);
      setSuccessMsg("Profile updated successfully!");
      await fetchProfile();
    } catch {
      setApiError("Failed to save changes!");
    }
  };

  // --- IMAGE UPLOAD/REMOVE ---
  const handleFileChange = (e) => setFileInput(e.target.files[0]);

  const handleImageUpload = async () => {
    if (!fileInput || !userId) return;
    setImgLoading(true); setApiError(""); setSuccessMsg("");
    const data = new FormData();
    data.append("file", fileInput);
    try {
      const token = sessionStorage.getItem("gymmateAccessToken");
      const res = await fetch(
        `http://localhost:8080/user/upload-photo/${userId}`,
        {
          method: "POST",
          body: data,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
      );
      if (!res.ok) throw new Error();
      setSuccessMsg("Profile photo updated!");
      setFileInput(null);
      await fetchProfile();
    } catch {
      setApiError("Failed to upload image.");
    }
    setImgLoading(false);
  };

  const handleRemoveImage = async () => {
    if (!userId) return;
    setImgLoading(true); setApiError(""); setSuccessMsg("");
    try {
      const token = sessionStorage.getItem("gymmateAccessToken");
      const res = await fetch(
        `http://localhost:8080/user/delete-photo/${userId}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        }
      );
      if (!res.ok) throw new Error();
      setSuccessMsg("Profile photo removed.");
      await fetchProfile();
    } catch {
      setApiError("Failed to remove image!");
    }
    setImgLoading(false);
  };

  if (loading)
    return (
      <div className="profilepage-bg">
        <div style={{ textAlign: 'center', padding: '70px' }}>Loading...</div>
      </div>
    );
  if (!form)
    return (
      <div className="profilepage-bg">
        <div style={{ color: 'red', textAlign: 'center', padding: '70px' }}>
          {apiError || "No Profile"}
        </div>
      </div>
    );

  return (
    <div className="profilepage-bg">
      <div className="profilepage-root">
        {/* Avatar */}
        <div className="profile-avatar-panel">
          <div className="profile-avatar" style={{ position: "relative" }}>
            <img
              src={
                form.imageUrl
                  ? form.imageUrl
                  : "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent((form.firstName || "") + " " + (form.lastName || "")) +
                    "&background=eee&color=222&size=98"
              }
              alt="Profile"
              style={{ objectFit: "cover" }}
            />
            {editing && (
              <>
                <label className="profile-avatar-upload-btn">
                  <FaCamera />
                  <input
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                {fileInput && (
                  <button
                    className="profile-avatar-upload-action"
                    onClick={handleImageUpload}
                    disabled={imgLoading}
                  >
                    {imgLoading ? "Uploading..." : "Upload"}
                  </button>
                )}
                {form.imageUrl &&
                  <button
                    onClick={handleRemoveImage}
                    className="profile-avatar-delete-btn"
                    disabled={imgLoading}
                  >
                    <FaTrash /> Remove
                  </button>
                }
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="profile-form-panel" style={{ margin: "0 auto" }}>
          <div className="profile-form-heading">Profile Details</div>
          <form onSubmit={handleSubmit}>
            <div className="profile-form-group">
              <label><FaUser className="profile-label-icon" /> First Name</label>
              <input
                name="firstName"
                value={form.firstName || ""}
                onChange={handleChange}
                required
                readOnly={!editing}
                className={`profile-input ${!editing ? "readonly" : ""}`}
              />
            </div>
            <div className="profile-form-group">
              <label><FaUser className="profile-label-icon" /> Last Name</label>
              <input
                name="lastName"
                value={form.lastName || ""}
                onChange={handleChange}
                required
                readOnly={!editing}
                className={`profile-input ${!editing ? "readonly" : ""}`}
              />
            </div>
            <div className="profile-form-group">
              <label><FaEnvelope className="profile-label-icon" /> Email</label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                required
                readOnly={!editing}
                className={`profile-input ${!editing ? "readonly" : ""}`}
              />
            </div>
            <div className="profile-form-group">
              <label><FaHome className="profile-label-icon" /> Address</label>
              <input
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                required
                readOnly={!editing}
                className={`profile-input ${!editing ? "readonly" : ""}`}
              />
            </div>
            <div className="profile-form-group">
              <label><FaPhone className="profile-label-icon" /> Mobile Number</label>
              <input
                name="mobile"
                value={form.mobile || ""}
                onChange={handleChange}
                required
                readOnly={!editing}
                className={`profile-input ${!editing ? "readonly" : ""}`}
              />
            </div>
            <div className="profile-form-group">
              <label><FaVenusMars className="profile-label-icon" /> Gender</label>
              <select
                name="gender"
                value={form.gender || ""}
                onChange={handleChange}
                disabled={!editing}
                className={`profile-input ${!editing ? "readonly" : ""}`}
              >
                {GENDERS.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
            <div className="profile-form-group">
              <label><FaChild className="profile-label-icon" /> Age</label>
              <input
                name="age"
                type="number"
                min="0"
                value={form.age || ""}
                onChange={handleChange}
                required
                readOnly={!editing}
                className={`profile-input ${!editing ? "readonly" : ""}`}
              />
            </div>
            <div className="profile-form-group">
              <label><FaFlag className="profile-label-icon" /> Goals</label>
              <input
                name="goals"
                value={form.goals || ""}
                onChange={handleChange}
                readOnly={!editing}
                className={`profile-input ${!editing ? "readonly" : ""}`}
              />
            </div>
            <div className="profile-form-group">
              <label><FaHeartbeat className="profile-label-icon" /> Conditions or Allergies</label>
              <input
                name="conditionsOrAllergies"
                value={form.conditionsOrAllergies || ""}
                onChange={handleChange}
                readOnly={!editing}
                className={`profile-input ${!editing ? "readonly" : ""}`}
                placeholder="Enter any medical condition or allergy"
              />
            </div>

            {/* Weight and Height side by side */}
            <div className="row">
              <div className="col-md-6 profile-form-group">
                <label><FaWeight className="profile-label-icon" /> Weight (kg)</label>
                <input
                  name="wieght"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.wieght || ""}
                  onChange={handleChange}
                  readOnly={!editing}
                  className={`profile-input ${!editing ? "readonly" : ""}`}
                />
              </div>
              <div className="col-md-6 profile-form-group">
                <label><FaWeight className="profile-label-icon" /> Height (cm)</label>
                <input
                  name="height"
                  type="number"
                  step="0.1"
                  min="0"
                  value={form.height || ""}
                  onChange={handleChange}
                  readOnly={!editing}
                  className={`profile-input ${!editing ? "readonly" : ""}`}
                />
              </div>
            </div>

            {/* BMI */}
            <div className="profile-form-group">
              <label><FaWeight className="profile-label-icon" /> BMI</label>
              <input
                value={calculateBMI(form.height, form.wieght)}
                readOnly
                className="profile-input readonly"
                style={{ background: "#f5f5f5", fontWeight: 600, color: "#33691e" }}
              />
            </div>
            {apiError && <div style={{ color: '#c00', marginBottom: 7 }}>{apiError}</div>}
            {successMsg && <div style={{ color: 'green', marginBottom: 7 }}>{successMsg}</div>}
            <div style={{ marginTop: 14 }}>
              {editing ? (
                <button type="submit" className="profile-save-btn">
                  <FaSave className="profile-btn-icon" />
                  Save Changes
                </button>
              ) : (
                <button onClick={handleEdit} className="profile-edit-btn" type="button">
                  <FaUserEdit className="profile-btn-icon" />
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
