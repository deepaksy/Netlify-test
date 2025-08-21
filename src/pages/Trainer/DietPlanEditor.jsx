import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TrainerNavbar from '../../components/TrainerNavbar';
import {
  fetchUserDietPlan,
  updateUserDietPlan
} from '../../services/TrainerService';

const DietPlanEditor = () => {
  const { userId } = useParams();
  const [userName, setUserName] = useState("Loading...");
  const [dietPlan, setDietPlan] = useState(null);
  const [originalDiet, setOriginalDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchDiet = async () => {
      try {
        const data = await fetchUserDietPlan(userId);

    const plan = {
    breakfast: data.diet?.breakfast || '',
    midSnack: data.diet?.midSnack || '',
    lunch: data.diet?.lunch || '',
    dinner: data.diet?.dinner || '',
    instructions: data.diet?.instructions || ''
    };

        setUserName(`${data.firstName} ${data.lastName}`);
        setDietPlan(plan);
        setOriginalDiet(plan);
      } catch (error) {
        console.log(error);
        alert("Failed to load diet plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchDiet();
  }, [userId]);

  const handleChange = (meal, value) => {
    setDietPlan(prev => ({ ...prev, [meal]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        firstName: userName.split(" ")[0],
        lastName: userName.split(" ")[1],
        diet: dietPlan
      };

      await updateUserDietPlan(userId, payload);
      alert("Diet plan updated successfully!");
      setOriginalDiet(dietPlan);
      setEditMode(false);
    } catch (error) {
      console.log(error);
      alert("Failed to update diet plan.");
    }
  };

  const handleCancel = () => {
    setDietPlan(originalDiet);
    setEditMode(false);
  };

  return (
    <>
      <TrainerNavbar />
      <div className="container mt-5">
        <h2 className="text-center fw-bold mb-4">Diet Plan</h2>

        <div className="card p-4 shadow-sm rounded-4 border-0 mx-auto" style={{ maxWidth: '800px' }}>
          <h5 className="text-center text-primary mb-4">Plan for {userName}</h5>

          {loading ? (
            <p className="text-center text-muted">Loading...</p>
          ) : (
            <>
              {["breakfast", "midSnack", "lunch", "dinner"].map((mealKey, index) => (
                <div className="mb-4" key={index}>
                  <label className="form-label fw-semibold text-capitalize">
                    {mealKey.replace(/([A-Z])/g, ' $1')}
                  </label>
                  {editMode ? (
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder={`Enter ${mealKey} details...`}
                      value={dietPlan[mealKey]}
                      onChange={(e) => handleChange(mealKey, e.target.value)}
                    />
                  ) : (
                    <p className="border rounded p-3 bg-light text-muted">
                      {dietPlan[mealKey] || <em>No information provided.</em>}
                    </p>
                  )}
                </div>
              ))}

        <div className="mb-4">
          <label className="form-label fw-semibold text-capitalize">
              Instructions
          </label>
            {editMode ? (
        <textarea
            className="form-control"
            rows="3"
            placeholder="Any special instructions..."
            value={dietPlan.instructions}
            onChange={e => handleChange("instructions", e.target.value)}
        />
        ) : (
        <p className="border rounded p-3 bg-light text-muted">
        {dietPlan.instructions || <em>No instructions provided.</em>}
      </p>
        )}
      </div>

              <div className="text-center">
                {editMode ? (
                  <>
                    <button className="btn btn-success me-3 px-4" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary px-4" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-primary px-5" onClick={() => setEditMode(true)}>Edit Diet Plan</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DietPlanEditor;

