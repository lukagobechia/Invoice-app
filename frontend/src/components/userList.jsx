import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteConfirmation } from "./DeleteConfirmation";
import "../styles/userList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    show: false,
    userId: null,
  });
  const [error, setError] = useState(null);
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
      const response = await fetch("http://localhost:3001/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.log("Unauthorized or error fetching data");
        setError("Error fetching users");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error fetching users");
    }
  };

  const handleDelete = (userId) => {
    setDeleteConfirmation({ show: true, userId });
  };

  const confirmDelete = async () => {
    if (deleteConfirmation.userId) {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        setError("JWT token is not provided");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/users/${deleteConfirmation.userId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          setUsers(
            users.filter((user) => user._id !== deleteConfirmation.userId)
          );
          console.log("User deleted");
        } else {
          console.log("Error deleting user");
          setError("Error deleting user");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("Error deleting user");
      }

      setDeleteConfirmation({ show: false, userId: null });
    }
  };

  return (
    <div className="user-list">
      {error && <div className="error-message">{error}</div>}
      <div className="user-list-header">
        <div className="user-grid">
          <span>Name</span>
          <span>Email</span>
          <span>Phone</span>
          <span>Location</span>
          <span>Actions</span>
        </div>
      </div>
      <div className="user-list-body">
        {users.length === 0 ? (
          <div>No users found</div>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              className="user-grid cursor-pointer hover:bg-[#1E2139]"
              onClick={() => navigate(`/users/${user._id}`)}
            >
              <div className="user-name">
                <span>
                  {user.firstName} {user.lastName}
                </span>
                <span className="user-role">{user.role}</span>
              </div>
              <span>{user.email}</span>
              <span>{user.phoneNumber}</span>
              <span>
                {user.address.city}, {user.address.country}
              </span>
              <div
                className="user-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="button button-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(user._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <DeleteConfirmation
        isOpen={deleteConfirmation.show}
        onClose={() => setDeleteConfirmation({ show: false, userId: null })}
        onConfirm={confirmDelete}
        itemType="user"
      />
    </div>
  );
};

export default UserList;
