import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/invoices.css"
import InvoicesForm from "./invoicesForm"
import Loading from "./loading"

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([])
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("dueDate")
  const [sortOrder, setSortOrder] = useState("asc")
  const [toggle, setToggle] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)

  const endpoint1 = "http://localhost:3001/invoices"
  const endpoint2 = "http://localhost:3001/invoices/my-invoices"
  const pageSize = 5

  useEffect(() => {
    setCurrentPage(1)
  }, [])

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = toggle ? endpoint2 : endpoint1
      const response = await fetch(
        `${url}?page=${currentPage}&take=${pageSize}&status=${filter}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to fetch invoices")
      }

      const data = await response.json()
      setInvoices(data.invoices)
      setTotalPages(Math.ceil(data.total / pageSize))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [toggle, currentPage, filter, sortBy, sortOrder])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handleSortChange = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortOrder("asc")
    }
  }

  const sortedInvoices = invoices.sort((a, b) => {
    if (sortBy === "dueDate") {
      return sortOrder === "asc"
        ? new Date(a.paymentDue) - new Date(b.paymentDue)
        : new Date(b.paymentDue) - new Date(a.paymentDue)
    } else if (sortBy === "total") {
      return sortOrder === "asc" ? a.total - b.total : b.total - a.total
    }
    return 0
  })

  const handleAddInvoice = () => {
    setEditingInvoice(null)
    setShowForm(true)
  }

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingInvoice(null)
  }

  const navigate = useNavigate()

  const handleInvoiceClick = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`)
  }

  return (
    <div className="invoices-list">
      <div className="invoices-header">
        <div>
          <h1>Invoices</h1>
          <p>{sortedInvoices.length} invoices</p>
        </div>
        <div className="invoices-actions">
          <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <button className="button button-secondary" onClick={() => handleSortChange("dueDate")}>
            Due Date {sortBy === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button className="button button-secondary" onClick={() => handleSortChange("total")}>
            Total Amount {sortBy === "total" && (sortOrder === "asc" ? "↑" : "↓")}
          </button>
          <button className="button button-primary" onClick={handleAddInvoice}>
            <span className="plus-icon">+</span> New Invoice
          </button>
          <button className="button button-toggle" onClick={() => setToggle((prev) => !prev)}>
            {toggle ? "All Invoices" : "My Invoices"}
          </button>
        </div>
      </div>

      {loading && <Loading />}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className="invoices-grid">
        {sortedInvoices.map((invoice) => (
          <div key={invoice._id} className="invoice-card" onClick={() => handleInvoiceClick(invoice._id)}>
            <div className="invoice-id">#{invoice._id.slice(-6)}</div>
            <div className="invoice-due">Due {new Date(invoice.paymentDue).toLocaleDateString()}</div>
            <div className="invoice-client">{invoice.clientName}</div>
            <div className="invoice-total">${invoice.total.toFixed(2)}</div>
            <div className={`invoice-status ${invoice.status}`}>{invoice.status}</div>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          className="button button-secondary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="button button-secondary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>

      <button className="button button-primary go-back" onClick={() => (window.location.href = `/`)}>
        Go back
      </button>

      <div className={`sliding-panel ${showForm ? "open" : ""}`}>
        <div className="sliding-panel-content">
          <button className="close-panel" onClick={handleCloseForm}>
            &times;
          </button>
          <InvoicesForm
            invoice={editingInvoice}
            onClose={handleCloseForm}
            onSubmit={() => {
              handleCloseForm()
              fetchInvoices()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default InvoicesList

