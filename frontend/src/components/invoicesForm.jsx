import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "../styles/invoices.css"

const InvoicesForm = () => {
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
    senderAddress: {
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

  useEffect(() => {
    if (id) {
      // Fetch invoice data if editing
      const fetchInvoice = async () => {
        try {
          const response = await fetch(`http://localhost:3001/invoices/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          })
          if (!response.ok) throw new Error("Failed to fetch invoice")
          const data = await response.json()
          setFormData(data)
        } catch (error) {
          console.error("Error fetching invoice:", error)
        }
      }
      fetchInvoice()
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleAddressChange = (e, addressType) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [addressType]: {
        ...prevData[addressType],
        [name]: value,
      },
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
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
    const createdDate = new Date(createdAt);
    createdDate.setDate(createdDate.getDate() + paymentTerms);
    return createdDate.toISOString().split("T")[0];
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const updatedFormData = {
      ...formData,
      paymentDue: calculatePaymentDue(formData.createdAt, formData.paymentTerms),
    };
  
    try {
      const url = id ? `http://localhost:3001/invoices/${id}` : "http://localhost:3001/invoices";
      const method = id ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(updatedFormData),
      });
      if (!response.ok) throw new Error("Failed to save invoice");
      navigate("/invoices");
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="invoices-form">
      <h2>{id ? "Edit Invoice" : "New Invoice"}</h2>

      <div className="form-section">
        <h3>Bill From</h3>
        <div className="form-group">
          <label htmlFor="senderStreet">Street Address</label>
          <input
            id="senderStreet"
            name="street"
            value={formData.senderAddress.street}
            onChange={(e) => handleAddressChange(e, "senderAddress")}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="senderCity">City</label>
            <input
              id="senderCity"
              name="city"
              value={formData.senderAddress.city}
              onChange={(e) => handleAddressChange(e, "senderAddress")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senderState">State</label>
            <input
              id="senderState"
              name="state"
              value={formData.senderAddress.state}
              onChange={(e) => handleAddressChange(e, "senderAddress")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="senderPostalCode">Postal Code</label>
            <input
              id="senderPostalCode"
              name="postalCode"
              value={formData.senderAddress.postalCode}
              onChange={(e) => handleAddressChange(e, "senderAddress")}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="senderCountry">Country</label>
          <input
            id="senderCountry"
            name="country"
            value={formData.senderAddress.country}
            onChange={(e) => handleAddressChange(e, "senderAddress")}
            required
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Bill To</h3>
        <div className="form-group">
          <label htmlFor="clientName">Client's Name</label>
          <input id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="clientEmail">Client's Email</label>
          <input
            id="clientEmail"
            name="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="clientStreet">Street Address</label>
          <input
            id="clientStreet"
            name="street"
            value={formData.clientAddress.street}
            onChange={(e) => handleAddressChange(e, "clientAddress")}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="clientCity">City</label>
            <input
              id="clientCity"
              name="city"
              value={formData.clientAddress.city}
              onChange={(e) => handleAddressChange(e, "clientAddress")}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientState">State</label>
            <input
              id="clientState"
              name="state"
              value={formData.clientAddress.state}
              onChange={(e) => handleAddressChange(e, "clientAddress")}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientPostalCode">Postal Code</label>
            <input
              id="clientPostalCode"
              name="postalCode"
              value={formData.clientAddress.postalCode}
              onChange={(e) => handleAddressChange(e, "clientAddress")}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="clientCountry">Country</label>
          <input
            id="clientCountry"
            name="country"
            value={formData.clientAddress.country}
            onChange={(e) => handleAddressChange(e, "clientAddress")}
            required
          />
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
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="paymentTerms">Payment Terms</label>
            <select id="paymentTerms" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange}>
              <option value={1}>Net 1 Day</option>
              <option value={7}>Net 7 Days</option>
              <option value={14}>Net 14 Days</option>
              <option value={30}>Net 30 Days</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input id="description" name="description" value={formData.description} onChange={handleChange} required />
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
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor={`itemQuantity${index}`}>Qty.</label>
              <input
                id={`itemQuantity${index}`}
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value))}
                required
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor={`itemPrice${index}`}>Price</label>
              <input
                id={`itemPrice${index}`}
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", Number.parseFloat(e.target.value))}
                required
                min="0"
                step="0.01"
              />
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
      </div>

      <div className="form-actions">
        <button type="button" className="button button-secondary" onClick={() => navigate("/invoices")}>
          Cancel
        </button>
        <button type="submit" className="button button-primary">
          {id ? "Save Changes" : "Create Invoice"}
        </button>
      </div>
    </form>
  )
}

export default InvoicesForm

