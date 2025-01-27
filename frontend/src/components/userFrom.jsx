import React, { useState } from "react";
import "../styles/userForm.css";

const UserForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState(
    initialData || {
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
    }
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (!formData.email.includes("@")) newErrors.email = "Email must be valid";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!formData.phoneNumber.match(/^\+?[1-9]\d{1,14}$/)) newErrors.phoneNumber = "Phone number must be valid";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.address.street) newErrors.addressStreet = "Street address is required";
    if (!formData.address.city) newErrors.addressCity = "City is required";
    if (!formData.address.postalCode) newErrors.addressPostalCode = "Postal code is required";
    if (!formData.address.country) newErrors.addressCountry = "Country is required";

    if (!initialData) {
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      } else if (
        !formData.password.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
        )
      ) {
        newErrors.password =
          "Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&).";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const submitData = { ...formData };
      if (initialData) {
        delete submitData.password;
        delete submitData.confirmPassword;
      }

      try {
        const response = await fetch("http://localhost:3001/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify(submitData),
        });

        if (!response.ok) {
          throw new Error("Failed to create user");
        }

        const newUser = await response.json();
        onSubmit(newUser);
      } catch (error) {
        console.error("Error creating user:", error);
        setErrors({ submit: "Failed to create user. Please try again." });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const checkPasswordMatch = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

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
                  onBlur={checkPasswordMatch}
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
            value={formData.dob ? formData.dob.split("T")[0] : ""}
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
          />
          {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
        </div>

        <div className="form-group">
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

        <button type="submit" className="button button-primary" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

        {errors.submit && <span className="error-message">{errors.submit}</span>}
      </div>
    </form>
  );
};

export default UserForm;
