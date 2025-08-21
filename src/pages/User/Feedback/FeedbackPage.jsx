import React, { useEffect, useState } from "react";
import { FaStar, FaCommentDots } from "react-icons/fa";
import "./FeedbackPage.css";
import {jwtDecode} from "jwt-decode";
import { UserService } from "../../../services/UserService";
import axios from "axios";

function getCurrentUserIdFromToken() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.id || decoded.sub || decoded.email || null;
  } catch {
    return null;
  }
}

export default function FeedbackPage() {
  const [rating, setRating] = useState(0);
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trainer, setTrainer] = useState(null);
  const [loadingTrainer, setLoadingTrainer] = useState(true);

  const userId = getCurrentUserIdFromToken();

  // Fetch assigned trainer on component mount
  useEffect(() => {
    const fetchTrainer = async () => {
      if (!userId) {
        setTrainer(null);
        setLoadingTrainer(false);
        return;
      }
      const token = sessionStorage.getItem("gymmateAccessToken");
      try {
        const response = await axios.get(
          `http://localhost:8080/user/get-trainer/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTrainer(response.data);
      } catch (err) {
        console.error("Failed to fetch assigned trainer:", err);
        setTrainer(null);
      } finally {
        setLoadingTrainer(false);
      }
    };
    fetchTrainer();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("You must be logged in to submit feedback.");
      return;
    }
    if (!trainer) {
      alert("No assigned trainer found. Feedback submission requires a trainer.");
      return;
    }
    setLoading(true);
    const payload = {
      message: msg,
      rating,
      trainerId: String(trainer.trainerId),  // send as string for backend compatibility
    };

    const token = sessionStorage.getItem("gymmateAccessToken");
    try {
      await UserService.submitFeedback(userId, payload, token);
      setSent(true);
    } catch (err) {
      alert("Submission failed. Please try again.");
      console.error("Feedback submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feedback-bg">
      <div className="feedback-container">
        <div className="feedback-title-row">
          <span className="feedback-title">
            <FaCommentDots className="feedback-mainicon" />
            Support & Feedback
          </span>
          <div className="feedback-desc">
            Rate your experience and share your thoughts or suggestions.
          </div>
        </div>

        {loadingTrainer ? (
          <div>Loading your assigned trainer info...</div>
        ) : (
          <>
            {trainer ? (
              <div className="trainer-info">
                <strong>Assigned Trainer:</strong> {trainer.trainerName}
              </div>
            ) : (
              <div className="trainer-info-warning">
                No assigned trainer found for your profile.
              </div>
            )}

            {!sent ? (
              <form className="feedback-form" onSubmit={handleSubmit}>
                {/* Rating */}
                <div>
                  <label className="feedback-label">Rate Your Experience</label>
                  <div className="feedback-stars-row">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <FaStar
                        key={n}
                        className={`feedback-star${n <= rating ? " selected" : ""}`}
                        onClick={() => setRating(n)}
                        style={{ cursor: "pointer" }}
                      />
                    ))}
                    <span className="feedback-rating-number">
                      {rating ? `${rating}/5` : ""}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="feedback-label">Your Feedback</label>
                  <textarea
                    rows={5}
                    className="feedback-msg"
                    placeholder="Type your feedback, suggestion, or issue…"
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    required
                  />
                </div>

                <button
                  className="feedback-submitbtn"
                  disabled={loading || !msg || !rating || !trainer}
                  type="submit"
                >
                  <FaCommentDots className="feedback-submiticon" />
                  {loading ? "Sending..." : "Send Feedback"}
                </button>
              </form>
            ) : (
              <div className="feedback-confirm-msg">
                <span className="feedback-emoji">✅</span>
                Thank you for your feedback!
                {rating ? <span> (Rated: <span>{rating}/5</span>)</span> : null}
                <br />
                <span className="feedback-confirm-note">We’ll get back to you soon.</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
