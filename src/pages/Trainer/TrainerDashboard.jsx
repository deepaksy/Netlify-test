import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrainerNavbar from '../../components/TrainerNavbar.jsx';
import { getTrainerAssignedUsers } from '../../services/TrainerService.js';
import '../../styles/Trainer/TrainerDashboard.css';
import { jwtDecode } from 'jwt-decode';

const TrainerDashboard = () => {
  const navigate = useNavigate();
  const [assignedUsersCount, setAssignedUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [trainerId, setTrainerId] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("gymmateAccessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const id = decoded.id || decoded.userId || decoded.sub || null; 
        setTrainerId(id);
      } catch (err) {
        console.error("Error decoding JWT:", err);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      if (!trainerId) return;
      try {
        const users = await getTrainerAssignedUsers(trainerId);
        setAssignedUsersCount(users.length);
      } catch (error) {
        console.error('Error fetching assigned users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, [trainerId]);

  return (
    <>
      <TrainerNavbar />
      <div className="container mt-5">
        <h2 className="dashboard-title mb-5 text-center"> Trainer Dashboard</h2>
        <div className="row g-4 justify-content-center">

          {/* Assigned Users */}
          <div className="col-sm-6 col-md-4">
            <div className="dashboard-card shadow-sm">
              <h5 className="card-title">Assigned Users</h5>
              <p className="card-count">
                {loading ? 'Loading...' : `${assignedUsersCount} Users`}
              </p>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate('/trainer/users')}
              >
                View Users →
              </button>
            </div>
          </div>

          {/* Equipments */}
          <div className="col-sm-6 col-md-4">
            <div className="dashboard-card shadow-sm">
              <h5 className="card-title">Gym Equipments</h5>
              <p className="card-text">Manage and inspect equipment status.</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate('/trainer/equipments')}
              >
                Go to Equipments →
              </button>
            </div>
          </div>

          {/* Profile */}
          <div className="col-sm-6 col-md-4">
            <div className="dashboard-card shadow-sm">
              <h5 className="card-title">My Profile</h5>
              <p className="card-text">Update your personal details and bio.</p>
              <button
                className="btn btn-outline-primary"
                onClick={() => navigate('/trainer/profile')}
              >
                Edit Profile →
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default TrainerDashboard;
