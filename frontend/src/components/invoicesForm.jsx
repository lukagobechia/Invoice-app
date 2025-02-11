import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../styles/invoices.css"

const InvoicesForm = ({ onSubmit, onCancel, initialData, invoice }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    description: "",
    paymentTerms: 30,
    createdAt: new Date().toISOString().split("T")[0],
    paymentDue: "",
    clientName: "",
    clientEmail: "",
    clientAddress: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    items: [{ name: "", quantity: 1, price: 0, total: 0 }],
    total: 0,
    status: "pending",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }))
    }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = field === "quantity" || field === "price" ? Number(value) || 0 : value
    newItems[index].total = newItems[index].quantity * newItems[index].price

    setFormData((prevData) => ({
      ...prevData,
      items: newItems,
      total: newItems.reduce((sum, item) => sum + item.total, 0),
    }))
  }

  const handleAddItem = () => {
    setFormData((prevData) => ({
      ...prevData,
      items: [...prevData.items, { name: "", quantity: 1, price: 0, total: 0 }],
    }))
  }

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData((prevData) => ({
      ...prevData,
      items: newItems,
      total: newItems.reduce((sum, item) => sum + item.total, 0),
    }))
  }

  const calculatePaymentDue = (createdAt, paymentTerms) => {
    const createdDate = new Date(createdAt)
    createdDate.setDate(createdDate.getDate() + paymentTerms)
    return createdDate.toISOString().split("T")[0]
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required"
    if (!formData.clientEmail.trim()) newErrors.clientEmail = "Client email is required"
    if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) newErrors.clientEmail = "Client email is invalid"
    if (!formData.createdAt) newErrors.createdAt = "Invoice date is required"
    if (!formData.paymentTerms) newErrors.paymentTerms = "Payment terms are required"

    if (!formData.clientAddress.street.trim()) newErrors.clientAddressStreet = "Client street is required"
    if (!formData.clientAddress.city.trim()) newErrors.clientAddressCity = "Client city is required"
    if (!formData.clientAddress.postalCode.trim()) newErrors.clientAddressPostalCode = "Client postal code is required"
    if (!formData.clientAddress.country.trim()) newErrors.clientAddressCountry = "Client country is required"

    if (formData.items.length === 0) newErrors.items = "At least one item is required"
    formData.items.forEach((item, index) => {
      if (!item.name.trim()) newErrors[`itemName${index}`] = "Item name is required"
      if (item.quantity <= 0) newErrors[`itemQuantity${index}`] = "Quantity must be greater than 0"
      if (item.price < 0) newErrors[`itemPrice${index}`] = "Price must be 0 or greater"
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e, status) => {
    e.preventDefault()

    try {
      const userResponse = await fetch("http://localhost:3001/current-user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      })

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user information")
      }

      const userData = await userResponse.json()

      const sanitizedData = {
        description: formData.description,
        paymentTerms: formData.paymentTerms,
        createdAt: formData.createdAt.split("T")[0],
        paymentDue: calculatePaymentDue(formData.createdAt, formData.paymentTerms),
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientAddress: {
          street: formData.clientAddress.street,
          city: formData.clientAddress.city,
          state: formData.clientAddress.state || "",
          postalCode: formData.clientAddress.postalCode,
          country: formData.clientAddress.country,
        },
        senderAddress: {
          street: userData.address.street,
          city: userData.address.city,
          state: userData.address.state || "",
          postalCode: userData.address.postalCode,
          country: userData.address.country,
        },
        items: formData.items.map(({ name, quantity, price, total }) => ({
          name,
          quantity,
          price,
          total,
        })),
        total: formData.total,
        status: status || "pending",
        user: userData._id,
      }

      const url = invoice ? `http://localhost:3001/invoices/${invoice._id}` : "http://localhost:3001/invoices"
      const method = invoice ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(sanitizedData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Failed to save invoice: ${errorData.message || "Unknown error"}`)
      }

      onSubmit()
    } catch (error) {
      console.error("Error saving invoice:", error)
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(e, formData.status)} className="invoices-form">
      <h2>{id ? "Edit Invoice" : "New Invoice"}</h2>

      <div className="form-section">
        <h3>Bill To</h3>
        <div className="form-group">
          <label htmlFor="clientName">Client's Name</label>
          <input
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className={errors.clientName ? "error" : ""}
          />
          {errors.clientName && <span className="error-message">{errors.clientName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="clientEmail">Client's Email</label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleChange}
            className={errors.clientEmail ? "error" : ""}
          />
          {errors.clientEmail && <span className="error-message">{errors.clientEmail}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="clientStreet">Street Address</label>
          <input
            id="clientStreet"
            name="clientAddress.street"
            value={formData.clientAddress.street}
            onChange={handleChange}
            className={errors.clientAddressStreet ? "error" : ""}
          />
          {errors.clientAddressStreet && <span className="error-message">{errors.clientAddressStreet}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="clientCity">City</label>
            <input
              id="clientCity"
              name="clientAddress.city"
              value={formData.clientAddress.city}
              onChange={handleChange}
              className={errors.clientAddressCity ? "error" : ""}
            />
            {errors.clientAddressCity && <span className="error-message">{errors.clientAddressCity}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="clientState">State</label>
            <input
              id="clientState"
              name="clientAddress.state"
              value={formData.clientAddress.state}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientPostalCode">Postal Code</label>
            <input
              id="clientPostalCode"
              name="clientAddress.postalCode"
              value={formData.clientAddress.postalCode}
              onChange={handleChange}
              className={errors.clientAddressPostalCode ? "error" : ""}
            />
            {errors.clientAddressPostalCode && <span className="error-message">{errors.clientAddressPostalCode}</span>}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="clientCountry">Country</label>
          <input
            id="clientCountry"
            name="clientAddress.country"
            value={formData.clientAddress.country}
            onChange={handleChange}
            className={errors.clientAddressCountry ? "error" : ""}
          />
          {errors.clientAddressCountry && <span className="error-message">{errors.clientAddressCountry}</span>}
        </div>
      </div>

      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="createdAt">Invoice Date</label>
            <input
              id="createdAt"
              name="createdAt"
              type="date"
              value={formData.createdAt}
              onChange={handleChange}
              className={errors.createdAt ? "error" : ""}
            />
            {errors.createdAt && <span className="error-message">{errors.createdAt}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="paymentTerms">Payment Terms</label>
            <select
              id="paymentTerms"
              name="paymentTerms"
              value={formData.paymentTerms}
              onChange={handleChange}
              className={errors.paymentTerms ? "error" : ""}
            >
              <option value={1}>Net 1 Day</option>
              <option value={7}>Net 7 Days</option>
              <option value={14}>Net 14 Days</option>
              <option value={30}>Net 30 Days</option>
            </select>
            {errors.paymentTerms && <span className="error-message">{errors.paymentTerms}</span>}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "error" : ""}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3>Item List</h3>
        {formData.items.map((item, index) => (
          <div key={index} className="item-row">
            <div className="form-group">
              <label htmlFor={`itemName${index}`}>Item Name</label>
              <input
                id={`itemName${index}`}
                value={item.name}
                onChange={(e) => handleItemChange(index, "name", e.target.value)}
                className={errors[`itemName${index}`] ? "error" : ""}
              />
              {errors[`itemName${index}`] && <span className="error-message">{errors[`itemName${index}`]}</span>}
            </div>
            <div className="form-group">
              <label htmlFor={`itemQuantity${index}`}>Qty.</label>
              <input
                id={`itemQuantity${index}`}
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                className={errors[`itemQuantity${index}`] ? "error" : ""}
                min="1"
              />
              {errors[`itemQuantity${index}`] && (
                <span className="error-message">{errors[`itemQuantity${index}`]}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor={`itemPrice${index}`}>Price</label>
              <input
                id={`itemPrice${index}`}
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", e.target.value)}
                className={errors[`itemPrice${index}`] ? "error" : ""}
                min="0"
                step="0.01"
              />
              {errors[`itemPrice${index}`] && <span className="error-message">{errors[`itemPrice${index}`]}</span>}
            </div>
            <div className="form-group">
              <label>Total</label>
              <p>${item.total.toFixed(2)}</p>
            </div>
            <button type="button" className="button button-icon" onClick={() => handleRemoveItem(index)}>
              X
            </button>
          </div>
        ))}
        <button type="button" className="button button-secondary" onClick={handleAddItem}>
          + Add New Item
        </button>
        {errors.items && <span className="error-message">{errors.items}</span>}
      </div>

      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="button button-secondary" onClick={(e) => handleSubmit(e, "draft")}>
          Save as Draft
        </button>
        <button type="submit" className="button button-primary" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : id ? "Save Changes" : "Create Invoice"}
        </button>
      </div>
      {errors.submit && <span className="error-message">{errors.submit}</span>}
    </form>
  )
}

export default InvoicesForm

