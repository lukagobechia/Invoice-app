import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { DeleteConfirmation } from "./DeleteConfirmation"
import "../styles/userDetails.css"

const UserDetails = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false })
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserDetails()
  }, [id])

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
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("JWT token is not provided");
      return;
    }

    // Validate MongoDB ObjectId
    const userId = updatedUser.id || updatedUser._id;
    const objectIdPattern = /^[a-fA-F0-9]{24}$/;

    if (!objectIdPattern.test(userId)) {
      setError("Invalid user ID format");
      return;
    }

    // Ensure phoneNumber is treated as a string
    const formattedPhoneNumber = String(updatedUser.phoneNumber).startsWith("+")
      ? String(updatedUser.phoneNumber)
      : `+${updatedUser.phoneNumber}`;

    // Format data to match the backend's expectations
    const formattedData = {
      ...updatedUser,
      dob: new Date(updatedUser.dob).toISOString().split("T")[0], // Format date to YYYY-MM-DD
      phoneNumber: formattedPhoneNumber, // Ensure phone number is in international format
      address: {
        street: updatedUser.address?.street || "",
        city: updatedUser.address?.city || "",
        state: updatedUser.address?.state || null,
        postalCode: updatedUser.address?.postalCode || "",
        country: updatedUser.address?.country || "",
      },
      role: updatedUser.role || "user", // Set a default role if none provided
      company: updatedUser.company || "", // Optional field
    };

    try {
      // Make PATCH request to backend
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data); // Update the user state with the returned data
        setIsEditing(false); // Exit editing mode
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error updating user");
      }
    } catch (error) {
      setError("Error updating user");
      console.error("Update error:", error);
    }
  };


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

  if (loading) return <div className="user-details-loading">Loading...</div>
  if (error) return <div className="user-details-error">{error}</div>
  if (!user) return <div className="user-details-not-found">User not found</div>

  return (
    <div className="user-details">
      <div className="user-details-header">
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <div className="user-details-actions">
          <button className="button button-secondary" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancel" : "Edit"}
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
          {isEditing ? (
            <UserEditForm user={user} onSave={handleEdit} onCancel={() => setIsEditing(false)} />
          ) : (
            <UserInfo user={user} />
          )}
        </div>
      </div>
      <DeleteConfirmation
        isOpen={deleteConfirmation.show}
        onClose={() => setDeleteConfirmation({ show: false })}
        onConfirm={confirmDelete}
        itemType="user"
      />
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

const UserEditForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...user,
    dob: user.dob ? user.dob.split("T")[0] : "", // Ensure it's in the correct format for date input
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-edit-form">
      <div className="form-grid">
        <FormField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <FormField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <FormField
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
        <FormField
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          type="select"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </FormField>
        <FormField
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleChange}
        />
        <FormField
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
        />
      </div>
      <div className="address-section">
        <h3>Address</h3>
        <div className="form-grid">
          <FormField
            label="Street"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
          />
          <FormField
            label="City"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
          />
          <FormField
            label="Country"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
          />
          <FormField
            label="Postal Code"
            name="address.postalCode"
            value={formData.address.postalCode}
            onChange={handleChange}
          />
          <FormField
            label="State"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button button-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
};

const FormField = ({ label, name, value, onChange, error, children, type = "text" }) => (
  <div className="form-field">
    <label htmlFor={name}>{label}</label>
    {type === "select" ? (
      <select name={name} id={name} value={value} onChange={onChange}>
        {children}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
      />
    )}
    {error && <div className="error">{error}</div>}
  </div>
);

export default UserDetails;
