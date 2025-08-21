import React, { useState, useEffect } from "react";
import {
  getAllReceptionists,
  addReceptionist,
  updateReceptionist,
  deleteReceptionist,
  addTrainer,
  getAllTrainers,
  deleteTrainer,
  updateTrainer,
} from "../../services/AdminService";

const StaffSection = () => {
  const [type, setType] = useState("trainer");
  const [trainers, setTrainers] = useState([]);
  const [receps, setReceps] = useState([]);
  const [loadingReceps, setLoadingReceps] = useState(false);
  const [loadingTrainers, setLoadingTrainers] = useState(false);
  const [form, setForm] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    expertise: "",
    certifications: "",
    salary: "",
    address: "",
    password: "",
    gender: "MALE",
  });
  const [editing, setEditing] = useState(null);

  const staffFields =
    type === "trainer"
      ? [
          { name: "firstName", label: "First Name" },
          { name: "lastName", label: "Last Name" },
          { name: "email", label: "Email", type: "email" },
          { name: "mobile", label: "Mobile" },
          { name: "expertise", label: "Expertise" },
          { name: "certifications", label: "Certifications" },
          { name: "salary", label: "Salary" },
          { name: "address", label: "Address" },
          { name: "password", label: "Password", type: "password" },
        ]
      : [
          { name: "firstName", label: "First Name" },
          { name: "lastName", label: "Last Name" },
          { name: "email", label: "Email", type: "email" },
          { name: "mobile", label: "Mobile" },
          { name: "salary", label: "Salary" },
          { name: "address", label: "Address" },
          { name: "password", label: "Password", type: "password" },
        ];

  const staffList = type === "trainer" ? trainers : receps;
  const setStaffList = type === "trainer" ? setTrainers : setReceps;

  useEffect(() => {
    if (type === "recep") {
      setLoadingReceps(true);
      getAllReceptionists()
        .then(setReceps)
        .catch(() => setReceps([]))
        .finally(() => setLoadingReceps(false));
    } else {
      setLoadingTrainers(true);
      getAllTrainers()
        .then(setTrainers)
        .catch(() => setTrainers([]))
        .finally(() => setLoadingTrainers(false));
    }
  }, [type]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenderChange = (e) => {
    setForm((prev) => ({ ...prev, gender: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      id: null,
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      expertise: "",
      certifications: "",
      salary: "",
      address: "",
      password: "",
      gender: "MALE",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const entry = { ...form };

    if (type === "recep") {
      delete entry.expertise;
      delete entry.certifications;

      if (editing !== null && (!entry.password || entry.password.trim() === "")) {
        delete entry.password;
      }
      if (!entry.id && (!entry.password || entry.password.trim() === "")) {
        alert("Password is required for new receptionist.");
        return;
      }

      try {
        if (!entry.id) {
          await addReceptionist(entry);
        } else {
          await updateReceptionist(entry.id, entry);
        }
        setLoadingReceps(true);
        const updatedReceps = await getAllReceptionists();
        setReceps(updatedReceps);
        setEditing(null);
        resetForm();
      } catch (err) {
        alert("Error saving receptionist");
        console.error(err);
      } finally {
        setLoadingReceps(false);
      }
    } else {
      if (editing !== null && (!entry.password || entry.password.trim() === "")) {
        delete entry.password;
      }
      if (!entry.id && (!entry.password || entry.password.trim() === "")) {
        alert("Password is required for new trainer.");
        return;
      }
      try {
        if (!entry.id) {
          await addTrainer(entry);
          setLoadingTrainers(true);
          const updatedTrainers = await getAllTrainers();
          setTrainers(updatedTrainers);
          setLoadingTrainers(false);
        } else {
          await updateTrainer(entry.id, entry);
          setLoadingTrainers(true);
          const updatedTrainers = await getAllTrainers();
          setTrainers(updatedTrainers);
          setLoadingTrainers(false);
        }
        setEditing(null);
        resetForm();
      } catch (err) {
        alert("Error saving trainer");
        console.error(err);
      }
    }
  };

  const handleEdit = (i) => {
    const staff = staffList[i];
    setEditing(i);
    setForm({
      id: staff.id || null,
      firstName: staff.firstName || "",
      lastName: staff.lastName || "",
      email: staff.email || "",
      mobile: staff.mobile || "",
      expertise: staff.expertise || "",
      certifications: staff.certifications || "",
      salary: staff.salary || "",
      address: staff.address || "",
      password: "", 
      gender: staff.gender || "MALE",
    });
  };

  const handleDelete = async (i) => {
    const staff = staffList[i];

    if (type === "recep") {
      if (!staff.id) {
        alert("Receptionist ID missing");
        return;
      }
      if (!window.confirm("Are you sure you want to delete this receptionist?")) return;

      try {
        await deleteReceptionist(staff.id);
        setReceps((prev) => prev.filter((_, idx) => idx !== i));
        if (editing === i) {
          setEditing(null);
          resetForm();
        }
      } catch (err) {
        alert("Error deleting receptionist");
        console.error(err);
      }
    } else {
      if (!staff.id) {
        alert("Trainer ID missing");
        return;
      }
      if (!window.confirm("Are you sure you want to delete this trainer?")) return;

      try {
        await deleteTrainer(staff.id);
        setLoadingTrainers(true);
        const updatedTrainers = await getAllTrainers();
        setTrainers(updatedTrainers);
        setLoadingTrainers(false);
        if (editing === i) {
          setEditing(null);
          resetForm();
        }
      } catch (err) {
        alert("Error deleting trainer");
        console.error(err);
      }
    }
  };

  const staffTitle = type === "trainer" ? "Trainer" : "Receptionist";

  return (
    <div className="container my-5">
      <div className="mx-auto bg-white shadow p-4 rounded-4" style={{ maxWidth: 1000 }}>
        <h2 className="text-center fw-bold mb-3">Manage Staff</h2>
        <div className="mb-4 d-flex align-items-center justify-content-center gap-3">
          <label className="fw-semibold">Staff Type:</label>
          <select
            className="form-select w-auto"
            value={type}
            onChange={e => {
              setType(e.target.value);
              setEditing(null);
              resetForm();
            }}
          >
            <option value="trainer">Trainer</option>
            <option value="recep">Receptionist</option>
          </select>
        </div>

        {type === "recep" && loadingReceps && (
          <p className="text-center py-2 fw-semibold text-secondary">Loading receptionists...</p>
        )}
        {type === "trainer" && loadingTrainers && (
          <p className="text-center py-2 fw-semibold text-secondary">Loading trainers...</p>
        )}

        <form className="row g-3 mb-4" onSubmit={handleSubmit}>
          {staffFields.map(field =>
            field.name !== "gender" && (
              <div className="col-12 col-md-6 col-lg-4" key={field.name}>
                <label className="form-label fw-semibold">
                  {field.label}
                </label>
                <input
                  className="form-control"
                  name={field.name}
                  type={field.type || "text"}
                  value={form[field.name] || ""}
                  onChange={handleFieldChange}
                  required={field.name === "password" ? editing === null : true}
                  placeholder={field.label}
                />
              </div>
            )
          )}
          <div className="col-12 col-md-6 col-lg-4">
            <label className="form-label fw-semibold">Gender</label>
            <div>
              {["MALE", "FEMALE", "OTHER"].map(g => (
                <div className="form-check form-check-inline" key={g}>
                  <input className="form-check-input" type="radio" name="gender" id={`gender-${g}`}
                    value={g} checked={form.gender === g} onChange={handleGenderChange} required
                  />
                  <label className="form-check-label" htmlFor={`gender-${g}`}>
                    {g.charAt(0) + g.slice(1).toLowerCase()}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-primary fw-semibold">
              {editing !== null ? "Update" : "Add"} {staffTitle}
            </button>
            {editing !== null && (
              <button type="button" className="btn btn-secondary fw-semibold" onClick={() => { setEditing(null); resetForm(); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
        <div className="table-responsive rounded-4 shadow-sm bg-light">
          <table className="table align-middle mb-0">
            <thead className="table-primary text-white">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Mobile</th>
                {type === "trainer" && <th>Expertise</th>}
                {type === "trainer" && <th>Certifications</th>}
                <th>Salary</th>
                <th>Address</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffList.length === 0 ? (
                <tr>
                  <td colSpan={type === "trainer" ? 9 : 7}
                    className="text-center fst-italic py-4 text-secondary bg-white">
                    No {staffTitle.toLowerCase()}s found.
                  </td>
                </tr>
              ) : (
                staffList.map((staff, index) => (
                  <tr key={staff.id || index}>
                    <td>{staff.firstName}</td>
                    <td>{staff.lastName}</td>
                    <td>{staff.email}</td>
                    <td>{staff.mobile}</td>
                    {type === "trainer" && <td>{staff.expertise}</td>}
                    {type === "trainer" && <td>{staff.certifications}</td>}
                    <td>{staff.salary}</td>
                    <td>{staff.address}</td>
                    <td>{staff.gender}</td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2 fw-semibold text-white"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm fw-semibold"
                        onClick={() => handleDelete(index)}
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

export default StaffSection;
