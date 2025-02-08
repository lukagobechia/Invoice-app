import { Routes, Route } from "react-router-dom";
import AuthPage from "./components/authPage.jsx";
import Dashboard from "./components/dashboard.jsx";
import AuthGuard from "./components/authGuard.jsx";
import AdminGuard from "./components/adminGuard.jsx";
import Users from "./components/users.jsx";
import UserDetails from "./components/userDetails.jsx";
import InvoiceDetails from "./components/invoiceDetails.jsx";
import InvoicesForm from "./components/invoicesForm.jsx";
import InvoicesList from "./components/InvoicesList.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route element={<AuthGuard />}>
        <Route path="/" element={<Dashboard />} />
        <Route element={<AdminGuard />}>
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />
        </Route>
        <Route path="/invoices" element={<InvoicesList />} />
        <Route path="/invoices/:id" element={<InvoiceDetails />} />
        <Route path="/invoices/new" element={<InvoicesForm />} />
        <Route path="/invoices/:id/edit" element={<InvoicesForm />} />
      </Route>
    </Routes>
  );
}

export default App;
