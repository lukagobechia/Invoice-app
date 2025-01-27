import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/invoices.css"

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([])
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortOrder, setSortOrder] = useState("asc")

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("http://localhost:3001/invoices", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        })
        if (!response.ok) throw new Error("Failed to fetch invoices")
        const data = await response.json()
        setInvoices(data)
      } catch (error) {
        console.error("Error fetching invoices:", error)
      }
    }

    fetchInvoices()
  }, [])

  const filteredInvoices = invoices
    .filter((invoice) => filter === "all" || invoice.status === filter)
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return sortOrder === "asc"
          ? new Date(a.paymentDue) - new Date(b.paymentDue)
          : new Date(b.paymentDue) - new Date(a.paymentDue)
      } else if (sortBy === "total") {
        return sortOrder === "asc" ? a.total - b.total : b.total - a.total
      }
      return 0
    })

  return (
    <div className="invoices-list">
      <div className="invoices-header">
        <div>
          <h1>Invoices</h1>
          <p>{filteredInvoices.length} invoices</p>
        </div>
        <div className="invoices-actions">
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Due Date</option>
            <option value="total">Total Amount</option>
          </select>
          <button
            className="button button-secondary"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          <Link to="/invoices/new" className="button button-primary">
            <span className="plus-icon">+</span> New Invoice
          </Link>
        </div>
      </div>
      <div className="invoices-grid">
        {filteredInvoices.map((invoice) => (
          <Link to={`/invoices/${invoice._id}`} key={invoice._id} className="invoice-card">
            <div className="invoice-id">#{invoice._id.slice(-6)}</div>
            <div className="invoice-due">Due {new Date(invoice.paymentDue).toLocaleDateString()}</div>
            <div className="invoice-client">{invoice.clientName}</div>
            <div className="invoice-total">${invoice.total.toFixed(2)}</div>
            <div className={`invoice-status ${invoice.status}`}>{invoice.status}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default InvoicesList

