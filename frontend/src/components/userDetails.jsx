import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import "../styles/invoices.css"

const InvoiceDetails = () => {
  const [invoice, setInvoice] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`http://localhost:3001/invoices/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        if (!response.ok) throw new Error("Failed to fetch invoice")
        const data = await response.json()
        setInvoice(data)
      } catch (error) {
        console.error("Error fetching invoice:", error)
      }
    }

    fetchInvoice()
  }, [id])

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      try {
        const response = await fetch(`http://localhost:3001/invoices/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        if (!response.ok) throw new Error("Failed to delete invoice")
        navigate("/invoices")
      } catch (error) {
        console.error("Error deleting invoice:", error)
      }
    }
  }

  if (!invoice) return <div>Loading...</div>

  return (
    <div className="invoice-details">
      <Link to="/invoices" className="back-link">
        ← Go back
      </Link>
      <div className="invoice-header">
        <div className="invoice-status">
          Status: <span className={invoice.status}>{invoice.status}</span>
        </div>
        <div className="invoice-actions">
          <Link to={`/invoices/${id}/edit`} className="button button-secondary">
            Edit
          </Link>
          <button onClick={handleDelete} className="button button-delete">
            Delete
          </button>
        </div>
      </div>
      <div className="invoice-body">
        <div className="invoice-info">
          <h2>#{invoice._id.slice(-6)}</h2>
          <p>{invoice.description}</p>
        </div>
        <div className="invoice-addresses">
          <div className="sender-address">
            <h3>Sender Address</h3>
            <p>{invoice.senderAddress.street}</p>
            <p>
              {invoice.senderAddress.city}, {invoice.senderAddress.state}
            </p>
            <p>{invoice.senderAddress.postalCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
          <div className="client-address">
            <h3>Client Address</h3>
            <p>{invoice.clientAddress.street}</p>
            <p>
              {invoice.clientAddress.city}, {invoice.clientAddress.state}
            </p>
            <p>{invoice.clientAddress.postalCode}</p>
            <p>{invoice.clientAddress.country}</p>
          </div>
        </div>
        <div className="invoice-dates">
          <div>
            <h3>Invoice Date</h3>
            <p>{new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <h3>Payment Due</h3>
            <p>{new Date(invoice.paymentDue).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="invoice-client">
          <h3>Bill To</h3>
          <p>{invoice.clientName}</p>
          <p>{invoice.clientEmail}</p>
        </div>
        <div className="invoice-items">
          <h3>Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="invoice-total">
          <h3>Total</h3>
          <p>${invoice.total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceDetails

