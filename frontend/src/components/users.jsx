import { useState, useEffect } from "react"
import UserList from "./userList"
import "../styles/users.css"
import UserForm from './userFrom';

const Users = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
        } else {
          console.error("Failed to fetch users")
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  const handleAddUser = async (newUser) => {
    try {
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        const createdUser = await response.json()
        setUsers([...users, createdUser])
        setIsFormOpen(false)
      } else {
        console.error("Failed to create user")
      }
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setIsFormOpen(true)
  }

  const handleUpdateUser = async (updatedUser) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${updatedUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(updatedUser),
      })

      if (response.ok) {
        const updatedUserData = await response.json()
        setUsers(users.map((user) => (user._id === updatedUserData._id ? updatedUserData : user)))
        setIsFormOpen(false)
        setEditingUser(null)
      } else {
        console.error("Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId))
      } else {
        console.error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const openForm = () => {
    setEditingUser(null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingUser(null)
  }

  return (
    <div className="container">
      <div className="container-header">
        <h1>User Management</h1>
        <button className="button button-primary" onClick={openForm}>
          <span className="plus-icon">+</span> New User
        </button>
      </div>
      <UserList users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      <button className="button button-primary go-back" onClick={() => (window.location.href = `/`)}>
        Go back
      </button>

      <div className={`overlay ${isFormOpen ? "open" : ""}`} onClick={closeForm}></div>
      <div className={`side-panel ${isFormOpen ? "open" : ""}`}>
        <button className="side-panel-close" onClick={closeForm}>
          &times;
        </button>
        <UserForm
          onSubmit={editingUser ? handleUpdateUser : handleAddUser}
          onCancel={closeForm}
          initialData={editingUser}
        />
      </div>
    </div>
  )
}

export default Users

