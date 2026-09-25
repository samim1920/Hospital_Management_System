import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-100">

      <div className="flex h-full w-full overflow-hidden">

        {/* =========================
            SIDEBAR
        ========================= */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* =========================
            RIGHT SIDE
        ========================= */}
        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">

          {/* =========================
              NAVBAR
          ========================= */}
          <Navbar
            onMenuClick={() => setSidebarOpen(true)}
          />

          {/* =========================
              PAGE CONTENT
          ========================= */}
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">

            <Outlet />

            <Footer />

          </main>

        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;