import React, { useEffect, useState } from 'react';
import TrainerNavbar from '../../components/TrainerNavbar';
import {
  fetchTrainerProfile,
  updateTrainerProfile,
  uploadTrainerPhoto,
  deleteTrainerPhoto,
} from '../../services/TrainerService';
import '../../styles/Trainer/TrainerProfile.css';
import { jwtDecode } from 'jwt-decode';

const TrainerProfile = () => {
  const [trainerId, setTrainerId] = useState(null);

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    certifications: '',
    imageUrl: '',
    imagePublicId: '',
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');

  // Extract trainerId from token
  useEffect(() => {
    const token = sessionStorage.getItem("gymmateAccessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.id || decoded.userId || decoded.sub || null; // Adjust based on actual claim
        setTrainerId(id);
      } catch (err) {
        console.error("Error decoding JWT:", err);
      }
    }
  }, []);

  // Fetch profile after trainerId is available
  useEffect(() => {
    if (!trainerId) return;

    fetchTrainerProfile(trainerId)
      .then(data => {
        setProfile(data);
        setOriginalProfile(data);
      })
      .catch(() => setApiError("❌ Failed to load trainer profile"));
  }, [trainerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile || !trainerId) return;
    setUploading(true);
    try {
      const res = await uploadTrainerPhoto(trainerId, selectedFile);
      setProfile(prev => ({
        ...prev,
        imageUrl: res.secure_url,
        imagePublicId: res.public_id,
      }));
      setApiSuccess("Photo uploaded successfully");
      setApiError('');
    } catch {
      setApiError("Failed to upload photo");
      setApiSuccess('');
    }
    setUploading(false);
    setSelectedFile(null);
  };

  const handleDeletePhoto = async () => {
    if (!trainerId) return;
    try {
      await deleteTrainerPhoto(trainerId);
      setProfile(prev => ({ ...prev, imageUrl: '', imagePublicId: '' }));
      setApiSuccess("✅ Photo deleted successfully");
      setApiError('');
    } catch {
      setApiError("❌ Failed to delete photo");
      setApiSuccess('');
    }
  };

  const handleSave = () => {
    if (!trainerId) return;
    updateTrainerProfile(trainerId, profile)
      .then(() => {
        setOriginalProfile(profile);
        setIsEditing(false);
        setApiSuccess("✅ Profile updated successfully");
        setApiError('');
      })
      .catch(() => {
        setApiError("❌ Failed to update trainer profile");
        setApiSuccess('');
      });
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setSelectedFile(null);
    setApiSuccess('');
    setApiError('');
    setIsEditing(false);
  };

  const certList = profile.certifications
    ? profile.certifications.split(',').map(c => c.trim()).filter(Boolean)
    : [];

  return (
    <>
      <TrainerNavbar />
      <div className="container mt-5 trainer-profile-container">
        <h2 className="text-center mb-4 fw-bold">Trainer Profile</h2>

        {apiSuccess && <div className="alert alert-success">{apiSuccess}</div>}
        {apiError && <div className="alert alert-danger">{apiError}</div>}

        <div className="row g-4">
          {/* Profile Photo Card */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-header fw-semibold">Profile Photo</div>
              <div className="card-body text-center">
                {profile.imageUrl ? (
                  <>
                    <img
                      src={profile.imageUrl}
                      alt="Trainer"
                      className="img-fluid rounded mb-3"
                      style={{ height: '250px', objectFit: 'cover', width: '100%' }}
                    />
                    {isEditing && (
                      <button className="btn btn-danger btn-sm mb-3" onClick={handleDeletePhoto}>
                        Delete Photo
                      </button>
                    )}
                  </>
                ) : (
                  <p className="text-muted">No profile photo uploaded.</p>
                )}

                {isEditing && (
                  <div className="input-group">
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleUpload}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form Card */}
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header fw-semibold">Profile Details</div>
              <div className="card-body">
                <form>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        name="firstName"
                        value={profile.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        name="lastName"
                        value={profile.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input
                      className="form-control"
                      name="mobile"
                      value={profile.mobile}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Certifications</label>
                    <textarea
                      className="form-control"
                      name="certifications"
                      value={profile.certifications}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
                    />
                  </div>

                  {isEditing ? (
                    <div>
                      <button className="btn btn-success me-2" type="button" onClick={handleSave}>
                        Save
                      </button>
                      <button className="btn btn-secondary" type="button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-dark" type="button" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Certifications Display */}
            <div className="card shadow-sm mt-4">
              <div className="card-header fw-semibold">Certifications</div>
              <div className="card-body">
                {certList.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {certList.map((cert, idx) => (
                      <li key={idx} className="list-group-item">{cert}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No certifications listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainerProfile;
