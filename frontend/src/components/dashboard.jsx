import React, { useState, useEffect } from "react";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [users, setUsers] = useState(null);
  const [CurrentUsers, setCurrentUsers] = useState(null);
  const [error, setError] = useState("");

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
        console.log(data)
      } else {
        setError("Error fetching users");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error fetching users");
    }
  };

  return (
    <>
      <nav>
        <h1 className="dashboard-title">Welcome to Admin Panel</h1>
        <h2 className="user">
          Hi, {CurrentUsers?.firstName + " " + CurrentUsers?.lastName || "Admin"}
        </h2>
      </nav>
      <div className="dashboard">
        <div className="dashboard-content">
          {error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <div className="button-container">
                {["users", "invoices"].map((route) => (
                  <button
                    key={route}
                    className="dashboard-button"
                    onClick={() => (window.location.href = `/${route}`)}
                  >
                    View {route.charAt(0).toUpperCase() + route.slice(1)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
