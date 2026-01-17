

import React, { useState } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

import "./admin.css";

export default function AdminApp() {
  const [token, setToken] = useState(null);

  if (!token) {
    return <AdminLogin onLogin={setToken} />;
  }

  return <AdminDashboard />;
}
