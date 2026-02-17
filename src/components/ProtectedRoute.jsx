import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, type }) => {
  const userToken = localStorage.getItem("userToken");
  const adminToken = localStorage.getItem("adminToken");

  // 🔹 Protect USER routes
  if (type === "user") {
    if (!userToken) return <Navigate to="/user/login" replace />;
    if (adminToken) return <Navigate to="/admin" replace />;
  }

  // 🔹 Protect ADMIN routes
  if (type === "admin") {
    if (!adminToken) return <Navigate to="/admin-login" replace />;
    if (userToken) return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
