import React, { useEffect, useState } from "react";

import PatientService from "../Services/patientService";

function Patients() {
  // ==========================================
  // PATIENT DATA
  // ==========================================

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // SEARCH
  // ==========================================

  const [search, setSearch] = useState("");

  // ==========================================
  // MODAL
  // ==========================================

  const [showModal, setShowModal] = useState(false);

  // ==========================================
  // EDIT MODE
  // ==========================================

  const [editMode, setEditMode] = useState(false);

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    id: "",
    patientId: "",
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    department: "General Medicine",
    status: "Admitted",
  });

  // ==========================================
  // LOAD PATIENTS
  // ==========================================

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);

      const data = await PatientService.getAllPatients();

      setPatients(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load patients:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load patients"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // OPEN ADD MODAL
  // ==========================================

  const handleAddPatient = () => {
    setEditMode(false);

    const nextNumber = patients.length + 1;

    setFormData({
      id: "",
      patientId: `P${String(nextNumber).padStart(5, "0")}`,
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      department: "General Medicine",
      status: "Admitted",
    });

    setShowModal(true);
  };

  // ==========================================
  // ADD / UPDATE PATIENT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const patientData = {
        patientId: formData.patientId.trim(),
        name: formData.name.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        phone: formData.phone.trim(),
        department: formData.department,
        status: formData.status,
      };

      // ======================================
      // UPDATE
      // ======================================

      if (editMode) {
        const updatedPatient =
          await PatientService.updatePatient(
            formData.id,
            patientData
          );

        setPatients((prev) =>
          prev.map((patient) =>
            patient.id === updatedPatient.id
              ? updatedPatient
              : patient
          )
        );

        alert(
          "Patient updated successfully!"
        );
      }

      // ======================================
      // CREATE
      // ======================================

      else {
        const newPatient =
          await PatientService.createPatient(
            patientData
          );

        setPatients((prev) => [
          ...prev,
          newPatient,
        ]);

        alert(
          "Patient added successfully!"
        );
      }

      setShowModal(false);
    } catch (error) {
      console.error(
        "Patient operation failed:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // ==========================================
  // EDIT PATIENT
  // ==========================================

  const handleEdit = (patient) => {
    setEditMode(true);

    setFormData({
      id: patient.id,
      patientId: patient.patientId,
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      department: patient.department,
      status: patient.status,
    });

    setShowModal(true);
  };

  // ==========================================
  // DELETE PATIENT
  // ==========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await PatientService.deletePatient(id);

      setPatients((prev) =>
        prev.filter(
          (patient) => patient.id !== id
        )
      );

      alert(
        "Patient deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete patient error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete patient"
      );
    }
  };

  // ==========================================
  // SEARCH FILTER
  // ==========================================

  const filteredPatients = patients.filter(
    (patient) => {
      const searchValue =
        search.toLowerCase().trim();

      return (
        patient.name
          ?.toLowerCase()
          .includes(searchValue) ||

        patient.patientId
          ?.toLowerCase()
          .includes(searchValue) ||

        patient.phone
          ?.toLowerCase()
          .includes(searchValue) ||

        patient.department
          ?.toLowerCase()
          .includes(searchValue)
      );
    }
  );

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalPatients = patients.length;

  const admittedPatients =
    patients.filter(
      (patient) =>
        patient.status === "Admitted"
    ).length;

  const dischargedPatients =
    patients.filter(
      (patient) =>
        patient.status === "Discharged"
    ).length;

  const consultationPatients =
    patients.filter(
      (patient) =>
        patient.status === "Consultation"
    ).length;

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    if (status === "Admitted") {
      return "bg-orange-100 text-orange-700";
    }

    if (status === "Discharged") {
      return "bg-green-100 text-green-700";
    }

    return "bg-blue-100 text-blue-700";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-cyan-700 border-t-transparent"></div>

          <p className="text-sm text-gray-500">
            Loading patients...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* ======================================
          PAGE HEADER
      ====================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:mb-8 md:flex-row md:items-center md:justify-between">

        <div className="min-w-0">

          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Patients
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Manage hospital patients.
          </p>

        </div>

        {/* ADD PATIENT */}

        <button
          type="button"
          onClick={handleAddPatient}
          className="
            w-fit
            shrink-0
            rounded-lg
            bg-cyan-700
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-cyan-800
            active:scale-[0.98]
            sm:px-6
            sm:py-3
            sm:text-base
          "
        >
          + Add Patient
        </button>

      </div>


      {/* ======================================
          STATISTICS
      ====================================== */}

      <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:gap-4 lg:grid-cols-4 lg:gap-6">

        {/* TOTAL */}

        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">

          <p className="text-xs text-gray-500 sm:text-sm">
            Total Patients
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-800 sm:mt-2 sm:text-3xl">
            {totalPatients}
          </h2>

        </div>


        {/* ADMITTED */}

        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">

          <p className="text-xs text-gray-500 sm:text-sm">
            Admitted
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-800 sm:mt-2 sm:text-3xl">
            {admittedPatients}
          </h2>

        </div>


        {/* DISCHARGED */}

        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">

          <p className="text-xs text-gray-500 sm:text-sm">
            Discharged
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-800 sm:mt-2 sm:text-3xl">
            {dischargedPatients}
          </h2>

        </div>


        {/* CONSULTATION */}

        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">

          <p className="text-xs text-gray-500 sm:text-sm">
            Consultation
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-800 sm:mt-2 sm:text-3xl">
            {consultationPatients}
          </h2>

        </div>

      </div>


      {/* ======================================
          PATIENT LIST
      ====================================== */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* =================================
            TABLE HEADER
        ================================= */}

        <div className="flex flex-col gap-4 border-b p-4 sm:p-6 md:flex-row md:items-center md:justify-between">

          <div>

            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
              Patient List
            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              {filteredPatients.length} patient
              {filteredPatients.length !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

          </div>


          {/* SEARCH */}

          <div className="relative w-full md:w-72">

            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search patient..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                py-2.5
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:border-cyan-600
                focus:ring-2
                focus:ring-cyan-100
              "
            />

          </div>

        </div>


        {/* ==================================
            MOBILE PATIENT CARDS
        ================================== */}

        <div className="block p-4 sm:p-6 lg:hidden">

          {filteredPatients.length > 0 ? (

            <div className="space-y-4">

              {filteredPatients.map(
                (patient) => (

                  <div
                    key={patient.id}
                    className="
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-4
                      shadow-sm
                    "
                  >

                    {/* Patient Header */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-cyan-100
                            font-bold
                            text-cyan-700
                          "
                        >
                          {patient.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div className="min-w-0">

                          <h3 className="truncate font-semibold text-gray-800">
                            {patient.name}
                          </h3>

                          <p className="text-xs text-gray-500">
                            {patient.patientId}
                          </p>

                        </div>

                      </div>


                      {/* Status */}

                      <span
                        className={`
                          shrink-0
                          rounded-full
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                          ${getStatusStyle(
                            patient.status
                          )}
                        `}
                      >
                        {patient.status}
                      </span>

                    </div>


                    {/* Patient Information */}

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">

                      <div>

                        <p className="text-xs text-gray-400">
                          Age / Gender
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {patient.age} /{" "}
                          {patient.gender}
                        </p>

                      </div>


                      <div>

                        <p className="text-xs text-gray-400">
                          Phone
                        </p>

                        <p className="mt-1 truncate text-sm font-medium text-gray-700">
                          {patient.phone}
                        </p>

                      </div>


                      <div className="col-span-2">

                        <p className="text-xs text-gray-400">
                          Department
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-700">
                          {patient.department}
                        </p>

                      </div>

                    </div>


                    {/* Actions */}

                    <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(patient)
                        }
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          bg-blue-50
                          px-3
                          py-2.5
                          text-sm
                          font-medium
                          text-blue-700
                          transition
                          hover:bg-blue-700
                          hover:text-white
                        "
                      >
                        ✏️ Edit
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            patient.id
                          )
                        }
                        className="
                          flex
                          flex-1
                          items-center
                          justify-center
                          gap-2
                          rounded-lg
                          bg-red-50
                          px-3
                          py-2.5
                          text-sm
                          font-medium
                          text-red-600
                          transition
                          hover:bg-red-600
                          hover:text-white
                        "
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          ) : (

            <div className="py-10 text-center">

              <div className="mb-3 text-4xl">
                👥
              </div>

              <p className="text-sm text-gray-500">
                No patients found.
              </p>

            </div>

          )}

        </div>


        {/* ==================================
            DESKTOP TABLE
        ================================== */}

        <div className="hidden overflow-x-auto lg:block">

          <table className="w-full text-left">

            <thead className="bg-gray-50">

              <tr>

                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Patient
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Patient ID
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Age / Gender
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Phone
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Department
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                  Action
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-gray-100">

              {filteredPatients.map(
                (patient) => (

                  <tr
                    key={patient.id}
                    className="transition hover:bg-gray-50"
                  >

                    {/* PATIENT */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div
                          className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-cyan-100
                            font-bold
                            text-cyan-700
                          "
                        >
                          {patient.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <span className="font-semibold text-gray-800">
                          {patient.name}
                        </span>

                      </div>

                    </td>


                    {/* PATIENT ID */}

                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-700">
                      {patient.patientId}
                    </td>


                    {/* AGE / GENDER */}

                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-700">
                      {patient.age} /{" "}
                      {patient.gender}
                    </td>


                    {/* PHONE */}

                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-700">
                      {patient.phone}
                    </td>


                    {/* DEPARTMENT */}

                    <td className="px-6 py-5 text-sm text-gray-700">
                      {patient.department}
                    </td>


                    {/* STATUS */}

                    <td className="px-6 py-5">

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${getStatusStyle(
                            patient.status
                          )}
                        `}
                      >
                        {patient.status}
                      </span>

                    </td>


                    {/* ACTION */}

                    <td className="px-6 py-5">

                      <div className="flex gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(patient)
                          }
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-700
                            transition
                            hover:bg-blue-700
                            hover:text-white
                          "
                          title="Edit"
                        >
                          ✏️
                        </button>


                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              patient.id
                            )
                          }
                          className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            bg-red-50
                            text-red-600
                            transition
                            hover:bg-red-600
                            hover:text-white
                          "
                          title="Delete"
                        >
                          🗑
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>


          {filteredPatients.length === 0 && (

            <div className="py-12 text-center">

              <div className="mb-3 text-4xl">
                👥
              </div>

              <p className="text-gray-500">
                No patients found.
              </p>

            </div>

          )}

        </div>

      </div>


      {/* ======================================
          ADD / EDIT MODAL
      ====================================== */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-[70]
            flex
            items-center
            justify-center
            bg-black/50
            p-3
            sm:p-4
          "
        >

          <div
            className="
              flex
              max-h-[94vh]
              w-full
              max-w-2xl
              flex-col
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
              sm:max-h-[90vh]
            "
          >

            {/* MODAL HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b p-4 sm:p-6">

              <div className="min-w-0">

                <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">

                  {editMode
                    ? "Edit Patient"
                    : "Add New Patient"}

                </h2>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">

                  {editMode
                    ? "Update patient information"
                    : "Enter patient information"}

                </p>

              </div>


              {/* CLOSE */}

              <button
                type="button"
                onClick={() =>
                  setShowModal(false)
                }
                className="
                  ml-3
                  shrink-0
                  text-2xl
                  text-gray-400
                  transition
                  hover:text-gray-800
                "
                aria-label="Close"
              >
                ×
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="overflow-y-auto p-4 sm:p-6"
            >

              <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">

                {/* PATIENT ID */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Patient ID
                  </label>

                  <input
                    type="text"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    placeholder="P00001"
                    required
                    readOnly={editMode}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-gray-100
                      px-4
                      py-3
                      text-sm
                      outline-none
                    "
                  />

                </div>


                {/* NAME */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-cyan-600
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  />

                </div>


                {/* AGE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Enter age"
                    min="0"
                    max="150"
                    required
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-cyan-600
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  />

                </div>


                {/* GENDER */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-cyan-600
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  >

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* PHONE */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    maxLength={10}
                    inputMode="numeric"
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-cyan-600
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  />

                </div>


                {/* DEPARTMENT */}

                <div>

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Department
                  </label>

                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-cyan-600
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  >

                    <option value="General Medicine">
                      General Medicine
                    </option>

                    <option value="Cardiology">
                      Cardiology
                    </option>

                    <option value="Neurology">
                      Neurology
                    </option>

                    <option value="Orthopedics">
                      Orthopedics
                    </option>

                    <option value="Dermatology">
                      Dermatology
                    </option>

                    <option value="Pediatrics">
                      Pediatrics
                    </option>

                  </select>

                </div>


                {/* STATUS */}

                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Patient Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-4
                      py-3
                      text-sm
                      outline-none
                      focus:border-cyan-600
                      focus:ring-2
                      focus:ring-cyan-100
                    "
                  >

                    <option value="Admitted">
                      Admitted
                    </option>

                    <option value="Consultation">
                      Consultation
                    </option>

                    <option value="Discharged">
                      Discharged
                    </option>

                  </select>

                </div>

              </div>


              {/* BUTTONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:mt-8 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    px-6
                    py-3
                    text-sm
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-100
                    sm:w-auto
                  "
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="
                    w-full
                    rounded-lg
                    bg-cyan-700
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-cyan-800
                    sm:w-auto
                  "
                >
                  {editMode
                    ? "Update Patient"
                    : "Add Patient"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Patients;