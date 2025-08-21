import React, { useEffect, useState } from "react";
import { getAllFeedbacks } from "../../services/AdminService";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllFeedbacks();

        let list = res.data;
        if (Array.isArray(list)) {
        } else if (Array.isArray(res.data?.data)) {
          list = res.data.data;
        } else if (Array.isArray(res.data?.list)) {
          list = res.data.list;
        } else {
          list = [];
        }
        setFeedbacks(list);
      } catch (err) {
        setError("Could not load feedbacks.");
        setFeedbacks([]);
      }
      setLoading(false);
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="container my-5">
      <div className="mx-auto bg-white p-4 shadow rounded-4" style={{ maxWidth: 900 }}>
        <h2 className="fw-bold text-center mb-4">User Feedback</h2>
        {loading && <div className="text-center text-secondary mb-3">Loading feedbacks...</div>}
        {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}
        <div className="table-responsive rounded-4 shadow-sm bg-light">
          <table className="table align-middle mb-0">
            <thead className="table-primary text-white">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Trainer Name</th>
                <th>Message</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(feedbacks) ? feedbacks : []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center fst-italic py-4 text-secondary bg-white">
                    No feedbacks found.
                  </td>
                </tr>
              ) : (
                feedbacks.map((fb, i) => (
                  <tr key={fb._id ?? i}>
                    <td>{fb.firstName}</td>
                    <td>{fb.lastName}</td>
                    <td>{fb.trainerName}</td>
                    <td style={{ whiteSpace: "pre-line", maxWidth: 380 }}>{fb.message}</td>
                    <td>
                      {fb.rating}
                      {fb.rating && (
                        <span className="ms-2" aria-label="star" role="img" style={{ color: "#ffa400" }}>
                          ★
                        </span>
                      )}
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

export default Feedback;
