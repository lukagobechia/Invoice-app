import React, { useState, useEffect } from "react";
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

  const endpoint1 = "http://localhost:3001/invoices";
  const endpoint2 = "http://localhost:3001/invoices/my-invoices";

  const fetchInvoices = async (url) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch invoices");
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const url = toggle ? endpoint2 : endpoint1;
    fetchInvoices(url);
  }, [toggle]);

  const filteredInvoices = invoices
    .filter((invoice) => filter === "all" || invoice.status === filter)
    .sort((a, b) => {
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
          <p>{filteredInvoices.length} invoices</p>
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
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
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
            {toggle ? "Switch to All Invoices" : "Switch to My Invoices"}
          </button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <div className="invoices-grid">
        {filteredInvoices.map((invoice) => (
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
      <button
        className="button button-primary go-back"
        onClick={() => (window.location.href = `/dashboard`)}
      >
        Go back
      </button>
    </div>
  );
};

export default InvoicesList;
