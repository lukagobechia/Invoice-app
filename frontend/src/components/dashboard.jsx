import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [currentUsers, setCurrentUsers] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setError("JWT token is not provided");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/current-user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUsers(data);
      } else {
        setError("Error fetching users");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error fetching users");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  return (
    <>
      <nav>
        <h1 className="dashboard-title">Welcome to Admin Panel</h1>
        <h2 className="user">
          Hi,{" "}
          {currentUsers?.firstName + " " + currentUsers?.lastName || "Admin"}
        </h2>
        <button className="button button-secondary" onClick={handleSignOut}>
          Sign Out
        </button>
      </nav>
      <div className="dashboard">
        <div className="dashboard-content">
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <div className="button-container">
                {currentUsers?.role === "admin" && (
                  <button
                    className="dashboard-button"
                    onClick={() => navigate("/users")}
                  >
                    View Users
                  </button>
                )}
                <button
                  className="dashboard-button"
                  onClick={() => navigate("/invoices")}
                >
                  View Invoices
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
