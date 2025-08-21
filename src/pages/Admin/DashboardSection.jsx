import React, { useEffect, useState } from "react";
import { fetchDashboardStats, fetchPayments } from "../../services/AdminService";

const StatCard = ({ value, label, color, icon }) => (
  <div className="col-12 col-sm-6 col-lg-3">
    <div className="card text-center border-0 shadow-sm h-100 py-2">
      <div className="card-body py-3 px-1">
        <div className={`display-6 fw-bold ${color}`} style={{ fontSize: "2.2rem" }}>
          {icon} {value}
        </div>
        <div className="mt-1 fw-semibold fs-6 text-dark" style={{ fontSize: "1rem" }}>{label}</div>
      </div>
    </div>
  </div>
);

const DashboardSection = () => {
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [paymentsError, setPaymentsError] = useState("");

  useEffect(() => {
    async function getStats() {
      setLoadingStats(true);
      setStatsError("");
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        setStatsError("Failed to load dashboard stats.");
      }
      setLoadingStats(false);
    }
    getStats();
  }, []);

  useEffect(() => {
    async function getPayments() {
      setLoadingPayments(true);
      setPaymentsError("");
      try {
        const data = await fetchPayments();
        setPayments(data);
      } catch (err) {
        setPaymentsError("Failed to load payments.");
      }
      setLoadingPayments(false);
    }
    getPayments();
  }, []);

  return (
    <div className="container my-5">
      <div
        className="mx-auto p-4 bg-white shadow rounded-4"
        style={{ maxWidth: 1100, minHeight: 650 }}
      >
        <h2
          className="text-center mb-4 fw-bold text-primary"
          style={{ letterSpacing: "1px" }}
        >
          Admin Dashboard
        </h2>

        <div className="row g-3 mb-4 justify-content-center">
          {loadingStats ? (
            <div className="text-center py-4">Loading dashboard stats…</div>
          ) : statsError ? (
            <div className="text-center text-danger py-4">{statsError}</div>
          ) : stats ? (
            <>
              <StatCard
                value={stats.activeUsers}
                label="Active Users"
                color="text-success"
                icon="🟢"
              />
              <StatCard
                value={stats.totalUsers}
                label="Total Users"
                color="text-primary"
                icon="👥"
              />
              <StatCard
                value={stats.trainers}
                label="Trainers"
                color="text-info"
                icon="💪"
              />
              <StatCard
                value={stats.receptionists}
                label="Receptionists"
                color="text-warning"
                icon="🎧"
              />
              <StatCard
                value={
                  "₹" +
                  (stats.totalMoneyReceived || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })
                }
                label="Total Money Received"
                color="text-danger"
                icon="💰"
              />
              <StatCard
                value={stats.totalPackages}
                label="Total Packages"
                color="text-secondary"
                icon="📦"
              />
              <StatCard
                value={stats.totalEquipments}
                label="Total Equipments"
                color="text-dark"
                icon="🏋️"
              />
            </>
          ) : (
            <div className="text-center py-4">No statistics available.</div>
          )}
        </div>

        <h3
          className="text-center fw-bold mb-3"
          style={{ letterSpacing: "0.5px", color: "#222" }}
        >
          Recent Payments
        </h3>
        <div className="table-responsive rounded-4 shadow-sm bg-light">
          <table className="table align-middle mb-0">
            <thead className="table-primary text-white">
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Amount</th>
                <th>Subscription Name</th>
                <th>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {loadingPayments ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    Loading…
                  </td>
                </tr>
              ) : paymentsError ? (
                <tr>
                  <td colSpan={6} className="text-center text-danger py-4">
                    {paymentsError}
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center fst-italic py-4 text-secondary bg-white"
                  >
                    No payments found.
                  </td>
                </tr>
              ) : (
                payments
                  .slice(-5)
                  .reverse()
                  .map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.firstName}</td>
                      <td>{p.lastName}</td>
                      <td>₹{p.amount?.toFixed(2)}</td>
                      <td>{p.subscriptionName}</td>
                      <td>
                        {p.creationDate}
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

export default DashboardSection;
