import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronUp,
  ChevronDown,
  User,
  CreditCard,
  LogOut,
  Menu,
} from "lucide-react";

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  // Get hospital and admin information from localStorage
  const hospitalName = localStorage.getItem("hospitalName");
  const adminName = localStorage.getItem("adminName");
  const email = localStorage.getItem("email");

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("hospitalId");
    localStorage.removeItem("hospitalName");
    localStorage.removeItem("adminName");
    localStorage.removeItem("email");

    setIsProfileOpen(false);
    navigate("/login");
  };

  return (
    <nav className="h-16 min-h-16 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 relative z-40">

      {/* =========================
          LEFT SIDE
      ========================= */}
      <div className="flex items-center min-w-0">

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={onMenuClick}
          className="lg:hidden mr-3 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
          aria-label="Open sidebar"
        >
          <Menu size={24} className="text-gray-700" />
        </button>

        {/* TITLE */}
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
            Hospital Dashboard
          </h1>

          <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[180px] sm:max-w-[300px] lg:max-w-none">
            {hospitalName || "Hospital Management System"}
          </p>
        </div>
      </div>

      {/* =========================
          RIGHT SIDE
      ========================= */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-7">

        {/* =========================
            NOTIFICATION
        ========================= */}
        <button
          className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <Bell
            size={22}
            className="text-gray-600"
          />

          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] sm:text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* =========================
            ADMIN PROFILE
        ========================= */}
        <div className="relative">

          {/* PROFILE BUTTON */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 rounded-xl px-1.5 sm:px-2 py-1.5 sm:py-2 transition"
          >

            {/* AVATAR */}
            <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-cyan-700 text-white flex items-center justify-center text-base sm:text-lg lg:text-xl font-semibold shrink-0">
              {adminName
                ? adminName.charAt(0).toUpperCase()
                : "A"}
            </div>

            {/* NAME */}
            <div className="text-left hidden sm:block">
              <h3 className="text-sm lg:text-base font-semibold text-gray-900 max-w-[120px] lg:max-w-[180px] truncate">
                {adminName || "Admin"}
              </h3>

              <p className="text-xs lg:text-sm text-gray-500">
                Hospital Administrator
              </p>
            </div>

            {/* ARROW */}
            <div className="hidden sm:block">
              {isProfileOpen ? (
                <ChevronUp
                  size={18}
                  className="text-gray-500"
                />
              ) : (
                <ChevronDown
                  size={18}
                  className="text-gray-500"
                />
              )}
            </div>
          </button>

          {/* =========================
              PROFILE DROPDOWN
          ========================= */}
          {isProfileOpen && (
            <div className="absolute right-0 top-14 sm:top-16 w-[280px] sm:w-[300px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

              {/* LOGGED IN */}
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Logged in as
                </p>

                <p className="text-sm font-semibold text-gray-800 mt-1 truncate">
                  {adminName || "Admin"}
                </p>

                {email && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {email}
                  </p>
                )}
              </div>

              {/* =========================
                  MY PROFILE
              ========================= */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/my-profile");
                }}
                className="w-full flex items-center gap-4 px-5 py-4 text-left text-gray-700 hover:bg-gray-50 transition"
              >
                <User
                  size={21}
                  className="text-gray-400"
                />

                <span className="font-medium">
                  My Profile
                </span>
              </button>

              {/* =========================
                  ADD BANK ACCOUNT
              ========================= */}
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/add-bank-account");
                }}
                className="w-full flex items-center gap-4 px-5 py-4 text-left text-gray-700 hover:bg-gray-50 transition"
              >
                <CreditCard
                  size={21}
                  className="text-gray-400"
                />

                <span className="font-medium">
                  Add Bank Account
                </span>
              </button>

              {/* =========================
                  LOGOUT
              ========================= */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-5 py-4 text-left text-red-500 hover:bg-red-50 transition border-t border-gray-100"
              >
                <LogOut size={21} />

                <span className="font-medium">
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;