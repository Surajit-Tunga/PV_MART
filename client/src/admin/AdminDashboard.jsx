import React, { useState } from "react";
import AdminOrders from "./AdminOrders";

const TABS = ["Sellers", "Buyers", "Orders"];

export default function AdminDashboard() {
  const [tab, setTab] = useState("Sellers");

  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        {TABS.map((t) => (
          <button
            key={t}
            className={tab === t ? "active" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <div className="admin-content">
        {tab === "Sellers" && <div>Seller management coming soon...</div>}
        {tab === "Buyers" && <div>Buyer management coming soon...</div>}
        {tab === "Orders" && <AdminOrders />}
      </div>
    </div>
  );
}
