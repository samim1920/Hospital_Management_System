import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

// ===============================
// PUBLIC PAGES
// ===============================
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

// ===============================
// DASHBOARD PAGES
// ===============================
import Dashboard from "./Pages/Dashboard.jsx";
import Patient from "./Pages/Patient";
import Doctors from "./Pages/Doctor";
import Appointments from "./Pages/Appointments";
import DoctorProfile from "./Pages/DoctorProfile.jsx";
import MyProfile from "./Pages/MyProfile.jsx";
import AddBankAccount from "./Pages/AddBankAccount.jsx";

// ===============================
// LAYOUT
// ===============================
import DashboardLayout from "./Component/DashboardLayout";

// ===============================
// AXIOS
// ===============================
import AxiosInterceptor from "./Interceptor/AxiosInterceptor.jsx";


function App() {

  // ==========================================
  // TEST AXIOS CONNECTION
  // ==========================================

  const testAxios = async () => {
    try {

      const response =
        await AxiosInterceptor.get("/user/test");

      alert("✅ Axios Connection Successful");

      console.log("✅ AXIOS SUCCESS");
      console.log("Status:", response.status);
      console.log("Data:", response.data);

    } catch (error) {

      alert("❌ Axios Connection Failed");

      console.error("❌ AXIOS FAILED");

      if (error.response) {

        console.log(
          "Status:",
          error.response.status
        );

        console.log(
          "Data:",
          error.response.data
        );

      } else if (error.request) {

        console.log(
          "Server did not respond"
        );

      } else {

        console.log(
          "Error:",
          error.message
        );
      }
    }
  };


  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
        ========================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==========================================
            DASHBOARD LAYOUT

            Sidebar + Navbar are rendered
            ONCE here.

            All child pages will appear
            inside <Outlet />.
        ========================================== */}

        <Route element={<DashboardLayout />}>

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* PATIENTS */}
          <Route
            path="/patients"
            element={<Patient />}
          />

          {/* DOCTORS */}
          <Route
            path="/doctors"
            element={<Doctors />}
          />

          {/* APPOINTMENTS */}
          <Route
            path="/appointments"
            element={<Appointments />}
          />

          {/* DOCTOR PROFILE */}
          <Route
            path="/doctor/:id"
            element={<DoctorProfile />}
          />

          {/* MY PROFILE */}
          <Route
            path="/my-profile"
            element={<MyProfile />}
          />

          {/* ADD BANK ACCOUNT */}
          <Route
            path="/add-bank-account"
            element={<AddBankAccount />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;