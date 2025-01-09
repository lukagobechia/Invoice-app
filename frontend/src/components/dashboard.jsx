import React from "react";
import "../styles/dashboard.css";
const Dashboard = () => {
  return (
    <>
      <nav>
        <h1 className="dashboard-title">Admin Panel</h1>
      </nav>
      <div className="dashboard">
        <div className="dashboard-content">
          <div className="button-container">
            <button
              className="dashboard-button"
              onClick={() => (window.location.href = "/users")}
            >
              View Users
            </button>
            <button
              className="dashboard-button"
              onClick={() => (window.location.href = "/invoices")}
            >
              View Invoices
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
