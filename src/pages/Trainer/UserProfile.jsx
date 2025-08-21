import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TrainerNavbar from '../../components/TrainerNavbar';
import { fetchUserProfile } from '../../services/TrainerService';

// Helper function to calculate BMI
function calculateBMI(height, weight) {
  if (!height || !weight) return '';
  const heightM = height / 100; // height in meters
  return (weight / (heightM * heightM)).toFixed(2);
}

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserProfile(userId);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  return (
    <>
      <TrainerNavbar />
      <div className="container mt-5">
        <h2 className="text-center fw-bold mb-4">User Profile</h2>

        <div className="d-flex justify-content-center">
          <div className="card shadow-sm border-0 p-4 rounded-4" style={{ maxWidth: '500px', width: '100%' }}>
            {loading ? (
              <p className="text-muted text-center">Loading user details...</p>
            ) : user ? (
              <>
                <h4 className="mb-3 text-primary text-center">
                  {user.firstName} {user.lastName}
                </h4>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Gender:</strong> {user.gender}
                  </li>
                  <li className="list-group-item">
                    <strong>Age:</strong> {user.age}
                  </li>
                  <li className="list-group-item">
                    <strong>Goals:</strong> {user.goals || <em>No goals set</em>}
                  </li>
                  <li className="list-group-item">
                    <strong>Conditions / Allergies:</strong> {user.conditionsOrAllergies || <em>None</em>}
                  </li>
                  <li className="list-group-item">
                    <strong>Height:</strong> {user.height ? `${user.height} cm` : <em>Not set</em>}
                  </li>
                  <li className="list-group-item">
                    <strong>Weight:</strong> {user.weight ? `${user.weight} kg` : <em>Not set</em>}
                  </li>
                  <li className="list-group-item">
                    <strong>BMI:</strong> {user.height && user.weight ? calculateBMI(user.height, user.weight) : <em>N/A</em>}
                  </li>
                </ul>
              </>
            ) : (
              <p className="text-danger text-center">User not found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
