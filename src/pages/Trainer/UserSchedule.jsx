import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TrainerNavbar from '../../components/TrainerNavbar';
import { fetchUserSchedule, updateUserSchedule } from '../../services/TrainerService';

const UserSchedule = () => {
  const { userId } = useParams();
  const [userName, setUserName] = useState("Loading...");
  const [schedule, setSchedule] = useState({});
  const [originalSchedule, setOriginalSchedule] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [gender, setGender] = useState("");

  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const data = await fetchUserSchedule(userId);
        setUserName(`${data.firstName} ${data.lastName}`);
        setGender(data.gender || "OTHER");

        const scheduleData = {
          Monday: data.schedule?.monday || '',
          Tuesday: data.schedule?.tuesday || '',
          Wednesday: data.schedule?.wednesday || '',
          Thursday: data.schedule?.thursday || '',
          Friday: data.schedule?.friday || '',
          Saturday: data.schedule?.saturday || '',
          Sunday: data.schedule?.sunday || '',
          instructions: data.schedule?.instructions || ''
        };

        setSchedule(scheduleData);
        setOriginalSchedule(scheduleData);
      } catch {
        alert("Could not load schedule.");
      } finally {
        setLoading(false);
      }
    };

    loadSchedule();
  }, [userId]);

  const handleChange = (key, value) => {
    setSchedule(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        firstName: userName.split(" ")[0],
        lastName: userName.split(" ")[1],
        gender: gender,
        schedule: {
          monday: schedule.Monday,
          tuesday: schedule.Tuesday,
          wednesday: schedule.Wednesday,
          thursday: schedule.Thursday,
          friday: schedule.Friday,
          saturday: schedule.Saturday,
          sunday: schedule.Sunday,
          instructions: schedule.instructions
        }
      };

      await updateUserSchedule(userId, payload);
      alert("Schedule updated successfully!");
      setOriginalSchedule(schedule);
      setIsEditing(false);
    } catch {
      alert("Failed to update schedule.");
    }
  };

  const handleCancel = () => {
    setSchedule(originalSchedule);
    setIsEditing(false);
  };

  return (
    <>
      <TrainerNavbar />
      <div className="container mt-5">
        <h2 className="text-center fw-bold mb-4">Workout Schedule</h2>

        <div className="card p-4 rounded-4 shadow-sm border-0" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h5 className="text-center text-primary mb-4">Schedule for {userName}</h5>

          {loading ? (
            <p className="text-center text-muted">Loading schedule...</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-dark text-center">
                    <tr>
                      <th style={{ width: '30%' }}>Day</th>
                      <th>Workout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                      <tr key={day}>
                        <td className="fw-semibold text-center">{day}</td>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              className="form-control"
                              value={schedule[day]}
                              onChange={(e) => handleChange(day, e.target.value)}
                              placeholder="Enter workout"
                            />
                          ) : (
                            <span>{schedule[day] || <em className="text-muted">No workout assigned</em>}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Instructions field below the table */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Special Instructions
                </label>
                {isEditing ? (
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Enter any special instructions..."
                    value={schedule.instructions}
                    onChange={e => handleChange('instructions', e.target.value)}
                  />
                ) : (
                  <p className="border rounded p-3 bg-light text-muted">
                    {schedule.instructions || <em>No special instructions.</em>}
                  </p>
                )}
              </div>

              <div className="d-flex justify-content-center gap-3 mt-3">
                {isEditing ? (
                  <>
                    <button className="btn btn-success px-4" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary px-4" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <button className="btn btn-primary px-4" onClick={() => setIsEditing(true)}>Edit Schedule</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSchedule;
