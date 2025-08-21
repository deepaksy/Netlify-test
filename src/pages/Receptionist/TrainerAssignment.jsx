import React, { useEffect, useState } from "react";
import {
  fetchUserAndTrainerNames,
  assignTrainerToUser,
} from "../../services/TrainerServiceAssignment";

function TrainerAssignment() {
  const [members, setMembers] = useState([]);    // [{ id, firstName }]
  const [trainers, setTrainers] = useState([]);  // [{ id, firstName }]
  const [assignments, setAssignments] = useState({}); // { [userId]: trainerId }
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");    // Hold success message
  const [error, setError] = useState("");        // Hold error message

  useEffect(() => {
    fetchUserAndTrainerNames().then((data) => {
      setMembers(data.userNameList || []);
      setTrainers(data.trainerNameList || []);
    });
  }, []);

  const handleAssignChange = (userId, trainerId) => {
    setAssignments(prev => ({
      ...prev,
      [userId]: trainerId,
    }));
  };

  // This gets called when Assign button is pressed
  const handleAssignConfirm = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      // You can assign all at once by looping
      // Or create a batch API if your backend supports it
      const promises = Object.entries(assignments)
        .filter(([userId, trainerId]) => Boolean(trainerId))
        .map(([userId, trainerId]) =>
          assignTrainerToUser({
            userId: Number(userId),
            trainerId: Number(trainerId),
          })
        );
      await Promise.all(promises);
      setSuccess("Trainers assigned successfully!");
    } catch (e) {
      setError("Assignment failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <h4>Trainer Assignment</h4>
      <small className="text-muted mb-3 d-block">
        Assign trainers to gym members
      </small>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Assigned Trainer</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td>
                  <b>{member.firstName}</b>
                </td>
                <td>
                  <select
                    className="form-select"
                    value={assignments[member.id] || ""}
                    onChange={e =>
                      handleAssignChange(member.id, e.target.value)
                    }
                  >
                    <option value="">-- Select Trainer --</option>
                    {trainers.map(trainer => (
                      <option
                        key={trainer.id}
                        value={trainer.id}
                      >
                        {trainer.firstName}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {members.length === 0 &&
              <tr>
                <td colSpan="2" className="text-center text-muted">
                  No members available.
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <button
        className="btn btn-primary mt-3"
        onClick={handleAssignConfirm}
        disabled={loading || Object.keys(assignments).length === 0}
      >
        {loading ? "Assigning..." : "Assign Trainers"}
      </button>
    </div>
  );
}

export default TrainerAssignment;
