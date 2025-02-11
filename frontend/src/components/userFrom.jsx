import { useState, useEffect } from "react"
import "../styles/userForm.css"

const UserForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    role: "user",
    phoneNumber: "",
    address: {
      street: "",
      city: "",
      country: "",
      postalCode: "",
      state: "",
    },
    company: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (initialData) {
      // Format the date properly
      const formattedData = {
        ...initialData,
        dob: initialData.dob ? new Date(initialData.dob).toISOString().split("T")[0] : "",
      }
      setFormData(formattedData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (formData.phoneNumber) {
      const phoneRegex = /^([1-9]\d{1,14})$/
      if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be a valid number with 1-14 digits"
      }
    }
    if (!formData.dob) newErrors.dob = "Date of birth is required"
    if (!formData.address.street.trim()) newErrors.addressStreet = "Street is required"
    if (!formData.address.city.trim()) newErrors.addressCity = "City is required"
    if (!formData.address.country.trim()) newErrors.addressCountry = "Country is required"
    if (!formData.address.postalCode.trim()) newErrors.addressPostalCode = "Postal code is required"

    if (!initialData) {
      if (!formData.password) newErrors.password = "Password is required"
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
      if (formData.password && formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters long"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitting(true)
      const submitData = { ...formData }
      if (initialData) {
        delete submitData.password
        delete submitData.confirmPassword
      }

      try {
        await onSubmit(submitData)
      } catch (error) {
        console.error("Error submitting form:", error)
        setErrors({ submit: "Failed to submit form. Please try again." })
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-header">
        <h2>{initialData ? "Edit User" : "Create New User"}</h2>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? "error" : ""}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? "error" : ""}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {!initialData && (
          <>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                />
                <button type="button" onClick={() => togglePasswordVisibility("password")}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? "error" : ""}
                />
                <button type="button" onClick={() => togglePasswordVisibility("confirmPassword")}>
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="dob">Date of Birth</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className={errors.dob ? "error" : ""}
          />
          {errors.dob && <span className="error-message">{errors.dob}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={errors.role ? "error" : ""}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <span className="error-message">{errors.role}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={errors.phoneNumber ? "error" : ""}
            placeholder="e.g., 1234567890"
          />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="company">Company</label>
          <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} />
        </div>

        <div className="form-group full-width">
          <label>Address</label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            placeholder="Street"
            className={errors.addressStreet ? "error" : ""}
          />
          {errors.addressStreet && <span className="error-message">{errors.addressStreet}</span>}

          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            placeholder="City"
            className={errors.addressCity ? "error" : ""}
          />
          {errors.addressCity && <span className="error-message">{errors.addressCity}</span>}

          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            placeholder="State"
          />

          <input
            type="text"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            placeholder="Country"
            className={errors.addressCountry ? "error" : ""}
          />
          {errors.addressCountry && <span className="error-message">{errors.addressCountry}</span>}

          <input
            type="text"
            name="address.postalCode"
            value={formData.address.postalCode}
            onChange={handleChange}
            placeholder="Postal Code"
            className={errors.addressPostalCode ? "error" : ""}
          />
          {errors.addressPostalCode && <span className="error-message">{errors.addressPostalCode}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button button-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      {errors.submit && <span className="error-message">{errors.submit}</span>}
    </form>
  )
}

export default UserForm

