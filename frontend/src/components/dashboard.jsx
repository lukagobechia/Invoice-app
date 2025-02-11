import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardImage from "../assets/Email campaign_Flatline.png";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [currentUsers, setCurrentUsers] = useState(null);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
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
      const response = await fetch("https://invoice-app-zo8w.onrender.com/current-user", {
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

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <nav>
        <h1 className="dashboard-title">
          {currentUsers?.role === "admin" ? "Welcome to Admin Panel" : "Welcome to User Panel"}
        </h1>
        <div className="user-section">
          <h2 className="user">
            Hi,{" "}
            {currentUsers?.firstName + " " + currentUsers?.lastName || "Admin"}
          </h2>
          <button className="button theme-toggle-button" onClick={toggleTheme}>
            {theme === "dark" ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>
          <button className="button sign-out-button" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>
      <div className="dashboard">
        <img
          src={DashboardImage}
          alt="Dashboard Illustration"
          className="dashboard-image"
        />
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
