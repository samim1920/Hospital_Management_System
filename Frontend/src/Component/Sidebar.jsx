import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "📊",
    },
    {
      name: "Patients",
      path: "/patients",
      icon: "👥",
    },
    {
      name: "Doctors",
      path: "/doctors",
      icon: "👨‍⚕️",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "📅",
    },
    {
      name: "Departments",
      path: "/departments",
      icon: "🏢",
    },
    {
      name: "Staff",
      path: "/staff",
      icon: "👨‍💼",
    },
    {
      name: "Reports",
      path: "/reports",
      icon: "📈",
    },
    {
      name: "Settings",
      path: "/settings",
      icon: "⚙️",
    },
  ];

  // ==========================================
  // CLOSE SIDEBAR
  // ==========================================

  const closeSidebar = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* ==========================================
          MOBILE OVERLAY
      ========================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50

          flex
          h-screen
          w-64
          shrink-0
          flex-col

          bg-cyan-950
          text-white
          shadow-xl

          transition-transform
          duration-300
          ease-in-out

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:static
          lg:translate-x-0
          lg:shadow-none

          overflow-hidden
        `}
      >

        {/* ==========================================
            LOGO
        ========================================== */}

        <div
          className="
            relative
            flex
            h-20
            min-h-20
            shrink-0
            items-center
            gap-3
            border-b
            border-cyan-800
            px-6
          "
        >
          {/* Logo */}
          <div className="text-4xl">
            🏥
          </div>

          <div>
            <h1 className="text-xl font-bold">
              HMS
            </h1>

            <p className="text-xs text-cyan-300">
              Hospital Management
            </p>
          </div>

          {/* ==========================================
              MOBILE CLOSE BUTTON
          ========================================== */}

          <button
            type="button"
            onClick={closeSidebar}
            className="
              absolute
              right-3
              top-4
              rounded-lg
              p-2
              text-xl
              text-cyan-200
              hover:bg-cyan-800
              hover:text-white
              lg:hidden
            "
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* ==========================================
            MENU

            IMPORTANT:
            NO overflow-y-auto
            Sidebar will NOT scroll
        ========================================== */}

        <nav className="flex-1 overflow-hidden p-4">

          <div className="space-y-2">

            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `
                  flex
                  items-center
                  gap-3
                  rounded-lg
                  px-4
                  py-3
                  transition
                  duration-200

                  ${
                    isActive
                      ? "bg-cyan-700 text-white"
                      : "text-cyan-100 hover:bg-cyan-800"
                  }
                  `
                }
              >
                {/* ICON */}

                <span className="flex w-6 shrink-0 justify-center text-xl">
                  {item.icon}
                </span>

                {/* NAME */}

                <span className="font-medium">
                  {item.name}
                </span>
              </NavLink>
            ))}

          </div>

        </nav>

        {/* ==========================================
            LOGOUT
        ========================================== */}

        <div
          className="
            shrink-0
            border-t
            border-cyan-800
            p-4
          "
        >
          <NavLink
            to="/"
            onClick={closeSidebar}
            className="
              flex
              items-center
              gap-3
              rounded-lg
              bg-red-600
              px-4
              py-3
              transition
              hover:bg-red-700
            "
          >
            <span className="flex w-6 justify-center text-xl">
              🚪
            </span>

            <span className="font-medium">
              Logout
            </span>
          </NavLink>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;