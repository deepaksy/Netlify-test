import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaStar, FaMedal, FaCrown } from "react-icons/fa";
import { UserService } from "../../../services/UserService";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MemberShipPage.css";

// Helper: safely decode user from token in sessionStorage
function getDecodedUser() {
  const token = sessionStorage.getItem("gymmateAccessToken");
  if (!token) return {};
  try {
    return jwtDecode(token);
  } catch (e) {
    return {};
  }
}

function getIcon(idx) {
  switch (idx % 3) {
    case 0:
      return <FaStar size={26} color="#000" />;
    case 1:
      return <FaMedal size={26} color="#000" />;
    default:
      return <FaCrown size={26} color="#000" />;
  }
}

function getAccessDisplay(access) {
  if (access === "FULLTIME") return "Full-time";
  if (access === "OFF_PEAK_HOURS") return "Off-peak hours";
  return access || "N/A";
}

export default function MembershipPage() {
  const [packages, setPackages] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Always decode fresh from the JWT token on render
  const [tokenVersion, setTokenVersion] = useState(0);
  const user = getDecodedUser();

  const navigate = useNavigate();
  const location = useLocation();

  // Watch for sessionStorage token changes (e.g., login/logout in other tab)
  useEffect(() => {
    function handler(e) {
      if (e.key === "gymmateAccessToken") {
        setTokenVersion((v) => v + 1);
      }
    }
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // After login: if user is already subscribed, redirect.
  useEffect(() => {
    if (location.state && location.state.fromLogin && user.isSubscribed) {
      navigate("/user", { replace: true });
    }
  }, [navigate, location.state, user.isSubscribed]);

  // Fetch available membership packages (from UserService)
  useEffect(() => {
    setLoading(true);
    UserService.getMembershipPackages()
      .then((data) => {
        setPackages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading memberships...</div>;
  if (error)
    return (
      <div style={{ color: "red", marginTop: 16 }}>
        Error: {error}
      </div>
    );
  if (!Array.isArray(packages) || packages.length === 0)
    return <div>No membership packages available.</div>;

  const selected = packages[selectedIdx] || packages[0];
  const monthly =
    selected && selected.duration
      ? Math.round(selected.price / selected.duration)
      : selected?.price || 0;

  const alreadySubscribed = !!user.isSubscribed;
  const userId = user.id || user.sub || user.email;

  // Only calls UserService now
  const handleConfirm = async () => {
    setApiError("");
    if (!userId) {
      // Redirect to login page and show a message if not logged in
      navigate("/auth/signin", {
        state: {
          msg: "To view your purchased subscription, please log in again.",
        },
      });
      return;
    }
    if (!selected || !selected.name) {
      setApiError("Please select a membership package.");
      return;
    }
    if (alreadySubscribed) {
      setApiError("You already have an active subscription.");
      return;
    }
    setSubmitting(true);
    try {
      await UserService.buyMembershipPackage(userId, selected.name);

      // Remove old token forcing fresh login
      sessionStorage.removeItem("gymmateAccessToken");

      // Use toast instead of alert
      toast.success(
        "Successfully subscribed! Please log in again to view your subscription."
      );

      // Redirect after short delay to allow user to see toast
      setTimeout(() => {
        navigate("/auth/signin", {
          state: {
            msg:
              "Subscription successful! Please log in again to view your purchased subscription.",
          },
        });
      }, 2500); // 2.5 seconds delay
    } catch (err) {
      setApiError(err.message || "Subscription error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="membership-bg">
      <h2 className="membership-heading">Membership Packages</h2>

      {alreadySubscribed && (
        <div
          style={{
            color: "#669900",
            marginBottom: 12,
            fontWeight: 500,
          }}
        >
          You have an active subscription.
        </div>
      )}
      {apiError && (
        <div style={{ color: "red", marginBottom: 12 }}>{apiError}</div>
      )}

      <div className="membership-package-list">
        {packages.map((pkg, idx) => (
          <div
            key={pkg.id || pkg.name}
            className={`membership-package-card${idx === selectedIdx ? " selected" : ""}`}
            onClick={() => setSelectedIdx(idx)}
          >
            <div className="membership-card-title">
              {getIcon(idx)}
              <span className="membership-card-name">{pkg.name}</span>
              {pkg.discount > 0 && (
                <span className="membership-discount">
                  {Math.round(pkg.discount * 100)}%
                </span>
              )}
            </div>
            <div className="membership-card-desc">{pkg.description}</div>
            <ul className="membership-feature-list">
              <li>
                <b>Gym Access:</b> {getAccessDisplay(pkg.access)}
              </li>
              <li>
                <b>Diet Consultation:</b> {pkg.dietConsultation ? "Yes" : "No"}
              </li>
              <li>
                <b>Sauna Access:</b> {pkg.isSauna ? "Yes" : "No"}
              </li>
              <li>
                <b>Duration:</b> {pkg.duration} month{pkg.duration > 1 ? "s" : ""}
              </li>
              <li>
                <b>Price:</b> ₹{pkg.price}
              </li>
            </ul>
            <div className="membership-card-monthly">
              ({pkg.duration} {pkg.duration === 1 ? "month" : "months"})
              {idx === selectedIdx && <span>&nbsp;|&nbsp;₹{monthly}/mo</span>}
            </div>
          </div>
        ))}
      </div>

      {!alreadySubscribed && (
        <button
          className="membership-confirm-btn"
          onClick={handleConfirm}
          disabled={submitting}
        >
          {submitting ? (
            "Processing..."
          ) : (
            <>
              Confirm &amp; Pay for{" "}
              <span className="membership-btn-plan">{selected.name}</span>
            </>
          )}
        </button>
      )}

      {/* ToastContainer to display toasts */}
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />
    </div>
  );
}
