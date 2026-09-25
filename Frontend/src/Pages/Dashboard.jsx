import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import PatientService from "../Services/patientService";
import DoctorService from "../Services/doctorService";
import AppointmentService from "../Services/appoinmentService";

function Dashboard() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  useEffect(() => {
    loadDashboardData();
  }, []);

  const normalizeList = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    return [];
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [
        patientsResponse,
        doctorsResponse,
        appointmentsResponse,
      ] = await Promise.all([
        PatientService.getAllPatients(),
        DoctorService.getAllDoctors(),
        AppointmentService.getAllAppointments(),
      ]);

      const patientList = normalizeList(patientsResponse);
      const doctorList = normalizeList(doctorsResponse);
      const appointmentList = normalizeList(appointmentsResponse);

      setPatients(patientList);
      setDoctors(doctorList);
      setAppointments(appointmentList);

      console.log("DASHBOARD PATIENTS:", patientList);
      console.log("DASHBOARD DOCTORS:", doctorList);
      console.log("DASHBOARD APPOINTMENTS:", appointmentList);
    } catch (error) {
      console.error("Dashboard loading error:", error);

      setPatients([]);
      setDoctors([]);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalPatients = patients.length;
  const totalDoctors = doctors.length;

  // ==========================================
  // TODAY'S APPOINTMENTS
  // Only today's date is counted.
  // ==========================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const todayDate = getTodayDate();

  const todayAppointments = appointments.filter((appointment) => {
    const appointmentDate = String(
      appointment?.appointmentDate ?? ""
    ).slice(0, 10);

    return appointmentDate === todayDate;
  });

  const todayAppointmentCount = todayAppointments.length;

  // ==========================================
  // RECENT PATIENTS
  // ==========================================

  const recentPatients = [...patients]
    .sort((a, b) => {
      const aId = Number(a?.id || 0);
      const bId = Number(b?.id || 0);

      return bId - aId;
    })
    .slice(0, 5);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-full bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-cyan-700 border-t-transparent" />

            <p className="mt-4 text-gray-500">
              Loading dashboard...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <main className="min-h-full bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ==================================
            WELCOME
        ================================== */}

        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm sm:mb-8 sm:p-6">
          <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Welcome, Administrator 👋
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Here's what's happening in your hospital today.
          </p>
        </div>

        {/* ==================================
            STATISTICS
        ================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">

          {/* TOTAL PATIENTS */}

          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Total Patients
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                  {totalPatients}
                </h2>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-xl sm:h-14 sm:w-14 sm:text-2xl">
                👥
              </div>
            </div>
          </div>

          {/* TOTAL DOCTORS */}

          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Total Doctors
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                  {totalDoctors}
                </h2>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl sm:h-14 sm:w-14 sm:text-2xl">
                👨‍⚕️
              </div>
            </div>
          </div>

          {/* TODAY'S APPOINTMENTS */}

          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Today's Appointments
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                  {todayAppointmentCount}
                </h2>

                <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                  {todayDate}
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-xl sm:h-14 sm:w-14 sm:text-2xl">
                📅
              </div>
            </div>
          </div>

          {/* AVAILABLE BEDS */}

          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500 sm:text-sm">
                  Available Beds
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
                  —
                </h2>

                <p className="mt-1 text-[10px] text-gray-400 sm:text-xs">
                  Bed API not connected
                </p>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-xl sm:h-14 sm:w-14 sm:text-2xl">
                🛏️
              </div>
            </div>
          </div>

        </div>

        {/* ==================================
            TODAY'S APPOINTMENTS
        ================================== */}

        <div className="mt-6 rounded-2xl bg-white shadow-sm sm:mt-8">
          <div className="flex items-center justify-between border-b p-5 sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                Today's Appointments
              </h2>

              <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                {todayDate}
              </p>
            </div>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
              {todayAppointmentCount}
            </span>
          </div>

          <div className="p-5 sm:p-6">
            {todayAppointments.length === 0 ? (
              <div className="py-6 text-center">
                <div className="text-3xl">📅</div>

                <p className="mt-2 text-gray-400">
                  No appointments for today.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.slice(0, 5).map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col gap-2 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {appointment.patientName || "Patient"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Dr. {appointment.doctorName || "Doctor"}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="font-medium text-gray-700">
                        {appointment.appointmentTime || "--:--"}
                      </p>

                      <p className="text-xs text-gray-400">
                        {appointment.status || "Pending"}
                      </p>
                    </div>
                  </div>
                ))}

                {todayAppointments.length > 5 && (
                  <button
                    type="button"
                    onClick={() => navigate("/appointments")}
                    className="mt-2 w-full rounded-lg bg-gray-50 py-3 text-sm font-semibold text-cyan-700 hover:bg-cyan-50"
                  >
                    View all {todayAppointmentCount} appointments
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ==================================
            RECENT ACTIVITY
        ================================== */}

        <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-2">

          {/* RECENT PATIENTS */}

          <div className="rounded-2xl bg-white shadow-sm">
            <div className="border-b p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                  Recent Patients
                </h2>

                <span className="text-xs text-gray-400 sm:text-sm">
                  {patients.length} total
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {recentPatients.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-400">
                    No patients found.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5">
                  {recentPatients.map((patient) => (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-700">
                          {patient.name
                            ?.charAt(0)
                            ?.toUpperCase() || "P"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-800">
                            {patient.name || "Unnamed Patient"}
                          </p>

                          <p className="truncate text-xs text-gray-500 sm:text-sm">
                            Patient ID: {patient.patientId || "-"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 text-xs font-medium sm:text-sm ${
                          patient.status === "Discharged"
                            ? "text-green-600"
                            : patient.status === "Admitted"
                            ? "text-orange-600"
                            : "text-blue-600"
                        }`}
                      >
                        {patient.status || "Active"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DOCTORS */}

          <div className="rounded-2xl bg-white shadow-sm">
            <div className="border-b p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                  Doctors
                </h2>

                <span className="text-xs text-gray-400 sm:text-sm">
                  {doctors.length} total
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {doctors.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-400">
                    No doctors found.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {doctors.slice(0, 5).map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() =>
                        navigate(`/doctor/${doctor.id}`)
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault();
                          navigate(`/doctor/${doctor.id}`);
                        }
                      }}
                      className="group flex cursor-pointer items-center justify-between gap-3 rounded-xl p-2 transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      <div className="flex min-w-0 items-center gap-3">

                        {doctor.imageUrl ? (
                          <img
                            src={doctor.imageUrl}
                            alt={doctor.doctorname || "Doctor"}
                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {doctor.doctorname
                              ?.charAt(0)
                              ?.toUpperCase() || "D"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-800">
                            Dr. {doctor.doctorname || "Doctor"}
                          </p>

                          <p className="truncate text-xs text-gray-500 sm:text-sm">
                            {doctor.department || "Department"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 text-xs font-medium sm:text-sm ${
                          doctor.available
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {doctor.available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

export default Dashboard;
