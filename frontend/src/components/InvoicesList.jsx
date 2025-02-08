import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/invoices.css";

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortOrder, setSortOrder] = useState("asc");
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const endpoint1 = "http://localhost:3001/invoices";
  const endpoint2 = "http://localhost:3001/invoices/my-invoices";
  const pageSize = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = toggle ? endpoint2 : endpoint1;
      const response = await fetch(
        `${url}?page=${currentPage}&take=${pageSize}&status=${filter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }

      const data = await response.json();
      setInvoices(data.invoices);
      setTotalPages(Math.ceil(data.total / pageSize));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [toggle, currentPage, filter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const sortedInvoices = invoices.sort((a, b) => {
    if (sortBy === "dueDate") {
      return sortOrder === "asc"
        ? new Date(a.paymentDue) - new Date(b.paymentDue)
        : new Date(b.paymentDue) - new Date(a.paymentDue);
    } else if (sortBy === "total") {
      return sortOrder === "asc" ? a.total - b.total : b.total - a.total;
    }
    return 0;
  });

  return (
    <div className="invoices-list">
      <div className="invoices-header">
        <div>
          <h1>Invoices</h1>
          <p>{sortedInvoices.length} invoices</p>
        </div>
        <div className="invoices-actions">
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="dueDate">Due Date</option>
            <option value="total">Total Amount</option>
          </select>
          <button
            className="button button-secondary"
            onClick={() =>
              setSortOrder((prevOrder) =>
                prevOrder === "asc" ? "desc" : "asc"
              )
            }
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
          <Link to="/invoices/new" className="button button-primary">
            <span className="plus-icon">+</span> New Invoice
          </Link>
          <button
            className="button button-toggle"
            onClick={() => setToggle((prev) => !prev)}
          >
            {toggle ? "All Invoices" : "My Invoices"}
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className="invoices-grid">
        {sortedInvoices.map((invoice) => (
          <Link
            to={`/invoices/${invoice._id}`}
            key={invoice._id}
            className="invoice-card"
          >
            <div className="invoice-id">#{invoice._id.slice(-6)}</div>
            <div className="invoice-due">
              Due {new Date(invoice.paymentDue).toLocaleDateString()}
            </div>
            <div className="invoice-client">{invoice.clientName}</div>
            <div className="invoice-total">${invoice.total.toFixed(2)}</div>
            <div className={`invoice-status ${invoice.status}`}>
              {invoice.status}
            </div>
          </Link>
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

      <button
        className="button button-primary go-back"
        onClick={() => (window.location.href = `/`)}
      >
        Go back
      </button>
    </div>
  );
};

export default InvoicesList;
