import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './RegisterPage.css';
import { UserService } from "../../services/UserService";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaVenusMars, FaBirthdayCake } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GENDERS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
];

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    mobile: '',
    age: '',          // <-- New field
    gender: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!formData.age || isNaN(formData.age) || Number(formData.age) < 10 || Number(formData.age) > 100) {
      toast.error("Please enter a valid age between 10 and 100.");
      return;
    }
    const { confirmPassword, ...payload } = formData;
    setLoading(true);
    try {
      const resp = await UserService.registerUser(payload);
      if (resp && resp.message) {
        if (resp.message.toLowerCase().includes("success")) {
          toast.success(resp.message, { autoClose: 1200 });
          setTimeout(() => {
            navigate("/auth/signin");
          }, 1300);
        } else {
          toast.info(resp.message);
        }
      } else {
        toast.error("Unexpected server response.");
      }
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-root">
      <ToastContainer position="top-center" />
      <div className="register-card-wide">
        <div className="register-header">
          <span className="register-brand">GymMate</span>
          <span className="register-header-sub">Create your account</span>
        </div>
        <form onSubmit={handleRegister} className="register-form-wide">
          <div className="register-row">
            <div className="register-col">
              <label>First Name</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="firstName"
                  className="register-input"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </div>
            </div>
            <div className="register-col">
              <label>Last Name</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="lastName"
                  className="register-input"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>
          <div className="register-row">
            <div className="register-col">
              <label>Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  name="email"
                  className="register-input"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="register-col">
              <label>Address</label>
              <div className="input-wrapper">
                <FaMapMarkerAlt className="input-icon" />
                <input
                  type="text"
                  name="address"
                  className="register-input"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </div>
            </div>
          </div>
          <div className="register-row">
            <div className="register-col">
              <label>Mobile Number</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input
                  type="text"
                  name="mobile"
                  pattern="^[0-9]{10,15}$"
                  title="Enter valid mobile number"
                  className="register-input"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                />
              </div>
            </div>
            <div className="register-col">
              <label>Age</label>
              <div className="input-wrapper">
                <FaBirthdayCake className="input-icon" />
                <input
                  type="number"
                  name="age"
                  className="register-input"
                  min="10"
                  max="100"
                  required
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  pattern="[0-9]+"
                  title="Enter a valid age"
                  style={{ paddingLeft: "40px" }}
                />
              </div>
            </div>
          </div>
          <div className="register-row">
            <div className="register-col">
              <label>Gender</label>
              <div className="input-wrapper">
                <FaVenusMars className="input-icon" />
                <select
                  name="gender"
                  className="register-input"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  style={{ paddingLeft: "40px" }}
                >
                  <option value="">Select Gender</option>
                  {GENDERS.map(g => (
                    <option value={g.value} key={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="register-col"></div>
          </div>
          <div className="register-row">
            <div className="register-col">
              <label>Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="password"
                  className="register-input"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="register-col">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  name="confirmPassword"
                  className="register-input"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          </div>
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="register-footer-link">
          Already have an account?{" "}
          <Link to="/auth/signin" className="brand-link">
            Login here
          </Link>
        </p>
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <button
            onClick={() => navigate("/auth/signin")}
            className="btn btn-link back-home-btn"
            type="button"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
