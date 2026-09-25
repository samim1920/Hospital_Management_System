import React, { useEffect, useState } from "react";

import AxiosInterceptor from "../Interceptor/AxiosInterceptor.jsx";
import PatientService from "../Services/patientService";
import DoctorService from "../Services/doctorService";
import AppointmentService from "../Services/appoinmentService";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const [formData, setFormData] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    department: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    paymentMethod: "ONLINE",
    paymentAmount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  // =========================================================
  // LOAD RAZORPAY CHECKOUT
  // =========================================================

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayReady(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () =>
        setRazorpayReady(true)
      );

      return () => {
        existingScript.removeEventListener("load", () =>
          setRazorpayReady(true)
        );
      };
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("Razorpay Checkout loaded");
      setRazorpayReady(true);
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay Checkout");
      setRazorpayReady(false);
    };

    document.body.appendChild(script);

    return () => {
      // Do not remove the script because other pages may use Razorpay.
    };
  }, []);

  const loadData = async () => {
    setLoading(true);

    await Promise.all([
      loadPatients(),
      loadDoctors(),
      loadAppointments(),
    ]);

    setLoading(false);
  };

  const normalizeList = (response) => {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.content)) return response.content;
    return [];
  };

  const loadPatients = async () => {
    try {
      setPatientsLoading(true);

      const response = await PatientService.getAllPatients();

      console.log("PATIENT API RESPONSE:", response);

      setPatients(normalizeList(response));
    } catch (error) {
      console.error("PATIENT API ERROR:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      setPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  const loadDoctors = async () => {
    try {
      setDoctorsLoading(true);

      const response = await DoctorService.getAllDoctors();

      console.log("DOCTOR API RESPONSE:", response);

      setDoctors(normalizeList(response));
    } catch (error) {
      console.error("DOCTOR API ERROR:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      setDoctors([]);
    } finally {
      setDoctorsLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      setAppointmentsLoading(true);

      const response =
        await AppointmentService.getAllAppointments();

      console.log("APPOINTMENT API RESPONSE:", response);

      setAppointments(normalizeList(response));
    } catch (error) {
      console.error("APPOINTMENT API ERROR:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      setAppointments([]);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const getDoctorFee = (doctor) => {
    if (!doctor) return 0;

    return Number(
      doctor.consultationFee ??
      doctor.consultation_fee ??
      0
    );
  };

  const findDoctor = (doctorId) => {
    return doctors.find(
      (doctor) =>
        String(doctor.id) === String(doctorId)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "patientId") {
      const patient = patients.find(
        (item) =>
          String(item.id) === String(value)
      );

      if (patient) {
        setFormData((prev) => ({
          ...prev,
          patientId: patient.id,
          patientName:
            patient.name ??
            patient.patientName ??
            "",
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          patientId: "",
          patientName: "",
        }));
      }

      return;
    }

    if (name === "doctorId") {
      const doctor = findDoctor(value);

      if (doctor) {
        const fee = getDoctorFee(doctor);

        setFormData((prev) => ({
          ...prev,
          doctorId: doctor.id,
          doctorName:
            doctor.doctorname ??
            doctor.doctorName ??
            "",
          department:
            doctor.department ?? "",
          paymentAmount: fee,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          doctorId: "",
          doctorName: "",
          department: "",
          paymentAmount: 0,
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnlinePayment = () => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: "ONLINE",
    }));
  };

  const handleHospitalPayment = () => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: "CASH",
    }));
  };

  const handleAddAppointment = () => {
    setEditMode(false);
    setSelectedAppointmentId(null);

    setFormData({
      patientId: "",
      patientName: "",
      doctorId: "",
      doctorName: "",
      department: "",
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      paymentMethod: "ONLINE",
      paymentAmount: 0,
    });

    setShowModal(true);
  };

  // =========================================================
  // OPEN RAZORPAY CHECKOUT
  // =========================================================

  const openRazorpayCheckout = async (appointmentResponse) => {
    try {
      const appointment =
        appointmentResponse?.data ??
        appointmentResponse;

      const appointmentId = appointment?.id;
      const razorpayOrderId = appointment?.razorpayOrderId;
      const amount = Number(
        appointment?.paymentAmount ??
        formData.paymentAmount ??
        0
      );

      if (!appointmentId) {
        throw new Error(
          "Appointment ID was not returned by the backend."
        );
      }

      if (!razorpayOrderId) {
        throw new Error(
          "Razorpay Order ID was not returned by the backend."
        );
      }

      if (!amount || amount <= 0) {
        throw new Error(
          "Invalid payment amount."
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout is not loaded. Please refresh the page."
        );
      }

      // Vite frontend environment variable.
      // IMPORTANT: only the Razorpay KEY ID belongs here.
      // Never put RAZORPAY_KEY_SECRET in React/frontend code.
      const razorpayKeyId =
        import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKeyId) {
        throw new Error(
          "VITE_RAZORPAY_KEY_ID is missing from frontend .env"
        );
      }

      const options = {
        key: razorpayKeyId,

        amount: Math.round(amount * 100),

        currency: "INR",

        name: "Hospital Management System",

        description: "Doctor Consultation Fee",

        order_id: razorpayOrderId,

        handler: async function (paymentResponse) {
          try {
            setLoading(true);

            console.log(
              "RAZORPAY PAYMENT RESPONSE:",
              paymentResponse
            );

            const verifyResponse =
              await AxiosInterceptor.post(
                `/appointment/${appointmentId}/payment/verify`,
                {
                  razorpayOrderId:
                    paymentResponse.razorpay_order_id,

                  razorpayPaymentId:
                    paymentResponse.razorpay_payment_id,

                  razorpaySignature:
                    paymentResponse.razorpay_signature,
                }
              );

            const verifiedAppointment =
              verifyResponse?.data ??
              verifyResponse;

            console.log(
              "PAYMENT VERIFIED:",
              verifiedAppointment
            );

            setAppointments((prev) =>
              prev.map((item) =>
                String(item.id) === String(appointmentId)
                  ? verifiedAppointment
                  : item
              )
            );

            setShowModal(false);
            resetForm();

            alert(
              "✅ Payment successful and appointment confirmed."
            );
          } catch (error) {
            console.error(
              "PAYMENT VERIFICATION ERROR:",
              error
            );

            console.error(
              "Status:",
              error.response?.status
            );

            console.error(
              "Response:",
              error.response?.data
            );

            alert(
              error.response?.data?.message ||
              error.response?.data ||
              "Payment was completed, but verification failed. Please contact the hospital."
            );
          } finally {
            setLoading(false);
          }
        },

        prefill: {
          name: formData.patientName || "Patient",
        },

        theme: {
          color: "#0891b2",
        },

        modal: {
          ondismiss: function () {
            console.log(
              "Razorpay Checkout closed by user."
            );
            setLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );

          alert(
            response?.error?.description ||
            "Payment failed. Your appointment is still pending."
          );

          setLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "RAZORPAY CHECKOUT ERROR:",
        error
      );

      alert(
        error.message ||
        "Unable to open Razorpay Checkout."
      );

      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId) {
      alert("Please select a patient.");
      return;
    }

    if (!formData.doctorId) {
      alert("Please select a doctor.");
      return;
    }

    if (!formData.appointmentDate) {
      alert("Please select appointment date.");
      return;
    }

    if (!formData.appointmentTime) {
      alert("Please select appointment time.");
      return;
    }

    if (
      !formData.paymentAmount ||
      Number(formData.paymentAmount) <= 0
    ) {
      alert("Doctor consultation fee is not available.");
      return;
    }

    try {
      setLoading(true);

      const appointmentData = {
        patientId: Number(formData.patientId),
        patientName: formData.patientName,
        doctorId: Number(formData.doctorId),
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        reason: formData.reason.trim(),
        paymentMethod: formData.paymentMethod,
      };

      console.log(
        "APPOINTMENT REQUEST:",
        appointmentData
      );

      if (!editMode) {
        const response =
          await AppointmentService.createAppointment(
            appointmentData
          );

        console.log(
          "APPOINTMENT CREATED:",
          response
        );

        const createdAppointment =
          response?.data ??
          response;

        setAppointments((prev) => [
          ...prev,
          createdAppointment,
        ]);

        // =====================================================
        // ONLINE PAYMENT
        // =====================================================

        if (
          formData.paymentMethod === "ONLINE"
        ) {
          if (!razorpayReady && !window.Razorpay) {
            throw new Error(
              "Razorpay Checkout is still loading. Please wait a moment and try again."
            );
          }

          // Keep the modal open until payment succeeds.
          await openRazorpayCheckout(
            createdAppointment
          );

          return;
        }

        // =====================================================
        // PAY AT HOSPITAL
        // =====================================================

        alert(
          "✅ Appointment created successfully. Pay at hospital."
        );

        setShowModal(false);
        resetForm();
      } else {
        const response =
          await AppointmentService.updateAppointment(
            selectedAppointmentId,
            appointmentData
          );

        console.log(
          "APPOINTMENT UPDATED:",
          response
        );

        const updatedAppointment =
          response?.data ??
          response;

        setAppointments((prev) =>
          prev.map((appointment) =>
            appointment.id === selectedAppointmentId
              ? updatedAppointment
              : appointment
          )
        );

        alert("Appointment updated successfully.");

        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("APPOINTMENT SAVE ERROR:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      alert(
        error.response?.data?.message ||
        "Failed to save appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      patientName: "",
      doctorId: "",
      doctorName: "",
      department: "",
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      paymentMethod: "ONLINE",
      paymentAmount: 0,
    });

    setSelectedAppointmentId(null);
    setEditMode(false);
  };

  const handleEdit = (appointment) => {
    const doctor = findDoctor(appointment.doctorId);
    const doctorFee = getDoctorFee(doctor);

    setEditMode(true);
    setSelectedAppointmentId(appointment.id);

    setFormData({
      patientId: appointment.patientId ?? "",
      patientName: appointment.patientName ?? "",
      doctorId: appointment.doctorId ?? "",
      doctorName:
        appointment.doctorName ??
        doctor?.doctorname ??
        "",
      department:
        appointment.department ??
        doctor?.department ??
        "",
      appointmentDate:
        appointment.appointmentDate ?? "",
      appointmentTime:
        appointment.appointmentTime ?? "",
      reason: appointment.reason ?? "",
      paymentMethod:
        appointment.paymentMethod ?? "ONLINE",
      paymentAmount:
        appointment.paymentAmount ??
        doctorFee ??
        0,
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await AppointmentService.deleteAppointment(id);

      setAppointments((prev) =>
        prev.filter(
          (appointment) =>
            appointment.id !== id
        )
      );

      alert("Appointment deleted successfully.");
    } catch (error) {
      console.error("DELETE ERROR:", error);
      console.error("Status:", error.response?.status);
      console.error("Response:", error.response?.data);

      alert(
        error.response?.data?.message ||
        "Failed to delete appointment."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments =
    appointments.filter((appointment) => {
      const searchText =
        search.toLowerCase().trim();

      if (!searchText) return true;

      return (
        String(appointment.patientName ?? "")
          .toLowerCase()
          .includes(searchText) ||
        String(appointment.patientId ?? "")
          .toLowerCase()
          .includes(searchText) ||
        String(appointment.doctorName ?? "")
          .toLowerCase()
          .includes(searchText) ||
        String(appointment.department ?? "")
          .toLowerCase()
          .includes(searchText) ||
        String(appointment.tokenNumber ?? "")
          .toLowerCase()
          .includes(searchText)
      );
    });

  const totalAppointments =
    appointments.length;

  const pendingAppointments =
    appointments.filter(
      (appointment) =>
        String(appointment.status).toUpperCase() ===
        "PENDING"
    ).length;

  const completedAppointments =
    appointments.filter(
      (appointment) =>
        String(appointment.status).toUpperCase() ===
        "COMPLETED"
    ).length;

  const paidAppointments =
    appointments.filter(
      (appointment) =>
        String(appointment.paymentStatus).toUpperCase() ===
        "PAID"
    ).length;

  const getStatusClass = (status) => {
    return String(status).toUpperCase() === "COMPLETED"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";
  };

  const getPaymentClass = (status) => {
    return String(status).toUpperCase() === "PAID"
      ? "text-green-600"
      : "text-yellow-600";
  };


  return (
    <>
      <main className="min-h-full overflow-x-hidden bg-gray-100 p-4 sm:p-6 lg:p-8">

          {/* PAGE HEADER */}

          <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-center md:justify-between">

            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Appointments
              </h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Manage hospital appointments
              </p>
            </div>

            <div className="flex w-full gap-2 sm:w-auto sm:gap-3">

              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:flex-none sm:py-3"
              >
                Refresh
              </button>

              <button
                type="button"
                onClick={handleAddAppointment}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:flex-none sm:px-5 sm:py-3"
              >
                + Add Appointment
              </button>

            </div>

          </div>

          {/* STATISTICS */}

          <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">

            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs text-gray-500 sm:text-sm">
                Total Appointments
              </p>
              <h2 className="mt-1 text-2xl font-bold text-gray-800 sm:mt-2 sm:text-3xl">
                {totalAppointments}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs text-gray-500 sm:text-sm">
                Pending
              </p>
              <h2 className="mt-1 text-2xl font-bold text-yellow-600 sm:mt-2 sm:text-3xl">
                {pendingAppointments}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs text-gray-500 sm:text-sm">
                Completed
              </p>
              <h2 className="mt-1 text-2xl font-bold text-green-600 sm:mt-2 sm:text-3xl">
                {completedAppointments}
              </h2>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm sm:p-5">
              <p className="text-xs text-gray-500 sm:text-sm">
                Paid
              </p>
              <h2 className="mt-1 text-2xl font-bold text-blue-600 sm:mt-2 sm:text-3xl">
                {paidAppointments}
              </h2>
            </div>

          </div>

          {/* SEARCH */}

          <div className="mb-6 rounded-xl bg-white p-3 shadow-sm sm:p-4">
            <input
              type="text"
              placeholder="Search by patient, doctor, department or token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* ==========================================
              APPOINTMENT LIST
          =========================================== */}

          <div className="mb-6 overflow-hidden rounded-xl bg-white shadow">

            {/* MOBILE CARDS */}

            <div className="block p-4 lg:hidden">

              {appointmentsLoading ? (
                <div className="py-10 text-center text-sm text-gray-500">
                  Loading appointments...
                </div>
              ) : filteredAppointments.length === 0 ? (
                <div className="py-10 text-center">
                  <div className="mb-2 text-4xl">📅</div>
                  <p className="text-sm text-gray-500">
                    No appointments found.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">

                  {filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="rounded-xl border border-gray-200 p-4 shadow-sm"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-blue-600">
                            Token: {appointment.tokenNumber ?? "-"}
                          </p>

                          <h3 className="mt-1 truncate text-base font-bold text-gray-800">
                            {appointment.patientName ?? "-"}
                          </h3>

                          <p className="text-xs text-gray-500">
                            Patient ID: {appointment.patientId ?? "-"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                            appointment.status
                          )}`}
                        >
                          {appointment.status ?? "PENDING"}
                        </span>

                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">

                        <div>
                          <p className="text-xs text-gray-400">Doctor</p>
                          <p className="mt-1 truncate text-sm font-semibold text-gray-700">
                            {appointment.doctorName ?? "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Department</p>
                          <p className="mt-1 truncate text-sm font-semibold text-gray-700">
                            {appointment.department ?? "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Date</p>
                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {appointment.appointmentDate ?? "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Time</p>
                          <p className="mt-1 text-sm font-medium text-gray-700">
                            {appointment.appointmentTime ?? "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Payment</p>
                          <p className="mt-1 text-sm font-semibold text-gray-800">
                            ₹{appointment.paymentAmount ?? 0}
                          </p>
                          <p className="text-xs text-gray-500">
                            {appointment.paymentMethod === "ONLINE"
                              ? "Online"
                              : "Hospital"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400">Payment Status</p>
                          <p
                            className={`mt-1 text-sm font-semibold ${getPaymentClass(
                              appointment.paymentStatus
                            )}`}
                          >
                            {appointment.paymentStatus ?? "PENDING"}
                          </p>
                        </div>

                      </div>

                      {appointment.reason && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <p className="text-xs text-gray-400">Reason</p>
                          <p className="mt-1 text-sm text-gray-700">
                            {appointment.reason}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">

                        <button
                          type="button"
                          onClick={() => handleEdit(appointment)}
                          className="flex flex-1 items-center justify-center rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(appointment.id)}
                          className="flex flex-1 items-center justify-center rounded-lg bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          🗑 Delete
                        </button>

                      </div>

                    </div>
                  ))}

                </div>
              )}

            </div>

            {/* DESKTOP TABLE */}

            <div className="hidden overflow-x-auto lg:block">

              <table className="w-full min-w-[1050px]">

                <thead className="bg-gray-50">
                  <tr>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Token
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Patient
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Doctor
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Department
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Date & Time
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Payment
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>

                    <th className="whitespace-nowrap px-5 py-4 text-left text-sm font-semibold text-gray-600">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {appointmentsLoading ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-10 text-center text-gray-500"
                      >
                        Loading appointments...
                      </td>
                    </tr>
                  ) : filteredAppointments.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="py-10 text-center text-gray-500"
                      >
                        No appointments found.
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="border-t transition hover:bg-gray-50"
                      >

                        <td className="px-5 py-4 font-semibold text-blue-600">
                          {appointment.tokenNumber ?? "-"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-gray-800">
                            {appointment.patientName ?? "-"}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {appointment.patientId ?? "-"}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {appointment.doctorName ?? "-"}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {appointment.department ?? "-"}
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-gray-700">
                            {appointment.appointmentDate ?? "-"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.appointmentTime ?? "-"}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-800">
                            ₹{appointment.paymentAmount ?? 0}
                          </div>

                          <div className="text-xs text-gray-500">
                            {appointment.paymentMethod === "ONLINE"
                              ? "Online"
                              : "Hospital"}
                          </div>

                          <span
                            className={`text-xs font-semibold ${getPaymentClass(
                              appointment.paymentStatus
                            )}`}
                          >
                            {appointment.paymentStatus ?? "PENDING"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              appointment.status
                            )}`}
                          >
                            {appointment.status ?? "PENDING"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex gap-2">

                            <button
                              type="button"
                              onClick={() => handleEdit(appointment)}
                              className="rounded-lg bg-blue-100 px-3 py-2 text-blue-700 transition hover:bg-blue-200"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(appointment.id)}
                              className="rounded-lg bg-red-100 px-3 py-2 text-red-700 transition hover:bg-red-200"
                            >
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </div>

      </main>

      {showModal && (

        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-3 sm:p-4">

          <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[92vh]">

            <div className="flex shrink-0 items-center justify-between border-b p-4 sm:p-6">

              <div>
                <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                  {editMode
                    ? "Edit Appointment"
                    : "Book Appointment"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select patient, doctor and payment method
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="ml-3 shrink-0 text-3xl text-gray-500 hover:text-gray-800"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto p-4 space-y-5 sm:p-6 sm:space-y-6"
            >

              {/* PATIENT */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Patient
                  </label>

                  <select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    disabled={patientsLoading}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                  >

                    <option value="">
                      {patientsLoading
                        ? "Loading patients..."
                        : patients.length === 0
                        ? "No patients found"
                        : "Select Patient"}
                    </option>

                    {patients.map((patient) => (
                      <option
                        key={
                          patient.id ??
                          patient.patientId
                        }
                        value={patient.id}
                      >
                        {patient.name ??
                          patient.patientName ??
                          "Unnamed Patient"}
                        {patient.patientId
                          ? ` - ${patient.patientId}`
                          : ""}
                      </option>
                    ))}

                  </select>

                  {!patientsLoading &&
                    patients.length === 0 && (
                      <p className="text-xs text-red-500 mt-2">
                        No patients found. Check PatientMs and its API response.
                      </p>
                    )}

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Patient ID
                  </label>

                  <input
                    type="text"
                    value={
                      patients.find(
                        (patient) =>
                          String(patient.id) ===
                          String(formData.patientId)
                      )?.patientId ??
                      formData.patientId ??
                      ""
                    }
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                  />

                </div>

              </div>

              {/* DOCTOR */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Doctor
                  </label>

                  <select
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleChange}
                    disabled={doctorsLoading}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    required
                  >

                    <option value="">
                      {doctorsLoading
                        ? "Loading doctors..."
                        : doctors.length === 0
                        ? "No doctors found"
                        : "Select Doctor"}
                    </option>

                    {doctors.map((doctor) => (
                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        {doctor.doctorname ??
                          doctor.doctorName ??
                          "Unnamed Doctor"}
                        {" - ₹"}
                        {getDoctorFee(doctor)}
                      </option>
                    ))}

                  </select>

                  {!doctorsLoading &&
                    doctors.length === 0 && (
                      <p className="text-xs text-red-500 mt-2">
                        No doctors found. Check DoctorMs and its API response.
                      </p>
                    )}

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department
                  </label>

                  <input
                    type="text"
                    value={formData.department}
                    readOnly
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                  />

                </div>

              </div>

              {/* DATE + TIME */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Appointment Date
                  </label>

                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Appointment Time
                  </label>

                  <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                    required
                  />

                </div>

              </div>

              {/* REASON */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason
                </label>

                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter appointment reason..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none"
                />

              </div>

              {/* CONSULTATION FEE */}

              <div className="bg-gray-50 border rounded-xl p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-gray-500">
                      Doctor Consultation Fee
                    </p>

                    <p className="text-3xl font-bold text-gray-800 mt-1">
                      ₹{formData.paymentAmount || 0}
                    </p>

                  </div>

                  <div className="text-4xl">
                    💰
                  </div>

                </div>

                <p className="text-xs text-gray-500 mt-3">
                  Final amount is verified by the backend.
                </p>

              </div>

              {/* PAYMENT METHOD */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Payment Method
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <button
                    type="button"
                    onClick={handleOnlinePayment}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition ${
                      formData.paymentMethod === "ONLINE"
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >

                    <div className="w-12 h-12 rounded-lg bg-white border flex items-center justify-center text-2xl">
                      💳
                    </div>

                    <div className="flex-1">
                      <div className="font-bold text-gray-800">
                        Online Payment
                      </div>

                      <div className="text-sm text-gray-500">
                        Pay ₹{formData.paymentAmount || 0} online
                      </div>
                    </div>

                    {formData.paymentMethod === "ONLINE" && (
                      <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                        <span className="text-white text-xs">
                          ✓
                        </span>
                      </div>
                    )}

                  </button>

                  <button
                    type="button"
                    onClick={handleHospitalPayment}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition ${
                      formData.paymentMethod === "CASH"
                        ? "border-cyan-500 bg-cyan-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >

                    <div className="w-12 h-12 rounded-lg bg-white border flex items-center justify-center text-2xl">
                      🏥
                    </div>

                    <div className="flex-1">
                      <div className="font-bold text-gray-800">
                        Pay at Hospital
                      </div>

                      <div className="text-sm text-gray-500">
                        Pay during visit
                      </div>
                    </div>

                    {formData.paymentMethod === "CASH" && (
                      <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
                        <span className="text-white text-xs">
                          ✓
                        </span>
                      </div>
                    )}

                  </button>

                </div>

              </div>

              {/* PAYMENT INFO */}

              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">

                {formData.paymentMethod === "ONLINE" ? (
                  <div className="flex gap-3">

                    <div className="text-xl">
                      💳
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        Online Payment
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        The consultation fee is{" "}
                        <strong>
                          ₹{formData.paymentAmount || 0}
                        </strong>
                        .
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="flex gap-3">

                    <div className="text-xl">
                      🏥
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        Pay at Hospital
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        Pay{" "}
                        <strong>
                          ₹{formData.paymentAmount || 0}
                        </strong>{" "}
                        during your hospital visit.
                      </p>
                    </div>

                  </div>
                )}

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="w-full rounded-lg border border-gray-300 px-5 py-3 hover:bg-gray-100 sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    patientsLoading ||
                    doctorsLoading ||
                    patients.length === 0 ||
                    doctors.length === 0
                  }
                  className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                >
                  {loading
                    ? "Saving..."
                    : editMode
                    ? "Update Appointment"
                    : "Book Appointment"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}
    </>
  );
}

export default Appointments;