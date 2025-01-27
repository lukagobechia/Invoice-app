import React, { useState } from 'react';
import UserForm from './userFrom';
import UserList from './userList';
import "../styles/users.css"

const Users = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);

  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, _id: Date.now().toString() }]);
    setShowForm(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map(user => 
      user._id === updatedUser._id ? updatedUser : user
    ));
    setShowForm(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user._id !== userId));
  };

  return (
    <div className="container">
      <div className="container-header">
        <h1>User Management</h1>
        <button 
          className="button button-primary"
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
        >
          <span className="plus-icon">+</span> New User
        </button>
      </div>
      {showForm ? (
        <UserForm 
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
          onCancel={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          initialData={editingUser}
        />
      ) : (
        <UserList 
          users={users}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}
        <button 
          className="button button-primary go-back"
          onClick={() => (window.location.href = `/dashboard`)}
        >
          Go back
        </button>
    </div>
  );
};

export default Users;
