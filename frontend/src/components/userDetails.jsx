import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { DeleteConfirmation } from "./DeleteConfirmation"
import UserForm from "./userFrom"
import "../styles/userDetails.css"
import Loading from "./loading"

const UserDetails = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false })
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const fetchUserDetails = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      setError("JWT token is not provided")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
      } else {
        setError("Error fetching user details")
      }
    } catch (error) {
      setError("Error fetching user details")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (updatedUser) => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      setError("JWT token is not provided")
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data)
        setIsEditFormOpen(false)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Error updating user")
      }
    } catch (error) {
      setError("Error updating user")
      console.error("Update error:", error)
    }
  }

  const handleDelete = () => {
    setDeleteConfirmation({ show: true })
  }

  const confirmDelete = async () => {
    const token = localStorage.getItem("jwtToken")
    if (!token) {
      setError("JWT token is not provided")
      return
    }

    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        navigate("/users")
      } else {
        setError("Error deleting user")
      }
    } catch (error) {
      setError("Error deleting user")
    } finally {
      setDeleteConfirmation({ show: false })
    }
  }

  if (loading) return <Loading />
  if (error) return <div className="user-details-error">{error}</div>
  if (!user) return <div className="user-details-not-found">User not found</div>

  return (
    <div className="user-details">
      <Link to="/users" className="back-link">
        ← Go back
      </Link>
      <div className="user-details-header">
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <div className="user-details-actions">
          <button className="button button-secondary" onClick={() => setIsEditFormOpen(true)}>
            Edit
          </button>
          <button className="button button-delete" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
      <div className="user-details-content">
        <div className="user-details-avatar">
          <img
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.firstName} ${user.lastName}`}
            alt="User avatar"
          />
        </div>
        <div className="user-details-info">
          <UserInfo user={user} />
        </div>
      </div>
      <DeleteConfirmation
        isOpen={deleteConfirmation.show}
        onClose={() => setDeleteConfirmation({ show: false })}
        onConfirm={confirmDelete}
        itemType="user"
      />
      <div className={`overlay ${isEditFormOpen ? "open" : ""}`} onClick={() => setIsEditFormOpen(false)}></div>
      <div className={`side-panel ${isEditFormOpen ? "open" : ""}`}>
        <button className="side-panel-close" onClick={() => setIsEditFormOpen(false)}>
          &times;
        </button>
        <UserForm onSubmit={handleEdit} onCancel={() => setIsEditFormOpen(false)} initialData={user} />
      </div>
    </div>
  )
}

const UserInfo = ({ user }) => (
  <div className="user-info-grid">
    <InfoField label="First Name" value={user.firstName} />
    <InfoField label="Last Name" value={user.lastName} />
    <InfoField label="Email" value={user.email} />
    <InfoField label="Phone Number" value={user.phoneNumber} />
    <InfoField label="Role" value={user.role} />
    <InfoField label="Date of Birth" value={user.dob} />
    <InfoField label="Company" value={user.company} />
    <div className="address-section">
      <h3>Address</h3>
      <InfoField label="Street" value={user.address.street} />
      <InfoField label="City" value={user.address.city} />
      <InfoField label="Country" value={user.address.country} />
      <InfoField label="Postal Code" value={user.address.postalCode} />
      <InfoField label="State" value={user.address.state} />
    </div>
  </div>
)

const InfoField = ({ label, value }) => (
  <div className="user-details-field">
    <span className="field-label">{label}:</span>
    <span className="field-value">{value}</span>
  </div>
)

export default UserDetails

