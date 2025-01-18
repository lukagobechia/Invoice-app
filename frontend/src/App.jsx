import { Routes, Route } from "react-router-dom";
import AuthPage from "./components/authPage.jsx";
import Dashboard from "./components/dashboard.jsx";
import AuthGuard from "./components/authGuard.jsx";
import Users from "./components/users.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route element={<AuthGuard />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
      </Route>
    </Routes>
  );
}

export default App;
