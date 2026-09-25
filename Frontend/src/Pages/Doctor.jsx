import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import DoctorService from "../Services/doctorService";

const EMPTY_FORM = {
  doctorname: "",
  doctorid: "",
  email: "",
  phone: "",
  department: "",
  experience: "",
  qualification: "",
  bio: "",
  rating: "",
  consultationFee: "",
  available: true,
};

const DEPARTMENTS = [
  "Neurology",
  "Cardiology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
  "Gynecology",
  "General Medicine",
  "ENT",
  "Ophthalmology",
  "Dentistry",
  "Psychiatry",
  "Urology",
  "Other",
];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function Doctor() {
  const navigate = useNavigate();

  // =====================================================
  // DOCTOR LIST
  // =====================================================

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  // =====================================================
  // MODAL
  // =====================================================

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // =====================================================
  // GALLERY IMAGES
  // =====================================================

  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // IDs of existing gallery images removed in the edit modal.
  // These can be sent to the backend when gallery-delete API is added.
  const [deletedGalleryIds, setDeletedGalleryIds] = useState([]);

  // =====================================================
  // FORM
  // =====================================================

  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
  });

  // =====================================================
  // LOAD DOCTORS
  // =====================================================

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);

      const data = await DoctorService.getAllDoctors();

      setDoctors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load doctors:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to load doctors."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Profile image must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));

    e.target.value = "";
  };

  // =====================================================
  // GALLERY IMAGE SELECT
  // =====================================================

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (
        !file.type.startsWith("image/") ||
        file.size > MAX_IMAGE_SIZE
      ) {
        invalidFiles.push(file);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      alert(
        "Some gallery images were skipped. Only image files under 5MB are allowed."
      );
    }

    if (validFiles.length > 0) {
      setGalleryImages((prev) => [...prev, ...validFiles]);

      const previews = validFiles.map((file) =>
        URL.createObjectURL(file)
      );

      setGalleryPreviews((prev) => [...prev, ...previews]);
    }

    e.target.value = "";
  };

  // =====================================================
  // REMOVE NEW GALLERY IMAGE
  // =====================================================

  const removeNewGalleryImage = (index) => {
    setGalleryImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setGalleryPreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =====================================================
  // REMOVE EXISTING GALLERY IMAGE FROM UI
  // =====================================================

  const removeExistingGalleryImage = (image) => {
    if (image?.id) {
      setDeletedGalleryIds((prev) =>
        prev.includes(image.id)
          ? prev
          : [...prev, image.id]
      );
    }

    setExistingGallery((prev) =>
      prev.filter((item) => item.id !== image.id)
    );
  };

  // =====================================================
  // OPEN ADD MODAL
  // =====================================================

  const handleAddDoctor = () => {
    setEditMode(false);
    setSelectedDoctorId(null);

    setSelectedImage(null);
    setPreviewImage("");

    setGalleryImages([]);
    setGalleryPreviews([]);
    setExistingGallery([]);
    setDeletedGalleryIds([]);

    setFormData({
      ...EMPTY_FORM,
    });

    setShowModal(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEditDoctor = (doctor) => {
    setEditMode(true);
    setSelectedDoctorId(doctor.id);

    setSelectedImage(null);
    setPreviewImage(doctor.imageUrl || "");

    setGalleryImages([]);
    setGalleryPreviews([]);
    setExistingGallery(
      Array.isArray(doctor.galleryImages)
        ? doctor.galleryImages
        : []
    );
    setDeletedGalleryIds([]);

    setFormData({
      doctorname: doctor.doctorname || "",
      doctorid: doctor.doctorid || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      department: doctor.department || "",
      experience: doctor.experience || "",
      qualification: doctor.qualification || "",
      bio: doctor.bio || "",
      rating: doctor.rating ?? "",
      consultationFee:
        doctor.consultationFee ??
        doctor.consultation_fee ??
        "",
      available: doctor.available ?? true,
    });

    setShowModal(true);
  };

  // =====================================================
  // VALIDATION
  // =====================================================

  const validateForm = () => {
    if (!formData.doctorname.trim()) {
      alert("Please enter doctor name.");
      return false;
    }

    if (!formData.doctorid.trim()) {
      alert("Please enter doctor ID.");
      return false;
    }

    if (!formData.email.trim()) {
      alert("Please enter doctor email.");
      return false;
    }

    if (!formData.department.trim()) {
      alert("Please select department.");
      return false;
    }

    if (!formData.experience.trim()) {
      alert("Please enter experience.");
      return false;
    }

    if (!formData.qualification.trim()) {
      alert("Please enter qualification.");
      return false;
    }

    if (
      formData.consultationFee === "" ||
      Number(formData.consultationFee) < 0
    ) {
      alert("Please enter a valid consultation fee.");
      return false;
    }

    if (
      formData.rating !== "" &&
      (Number(formData.rating) < 0 ||
        Number(formData.rating) > 5)
    ) {
      alert("Rating must be between 0 and 5.");
      return false;
    }

    return true;
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);

      const doctorData = {
        doctorname: formData.doctorname.trim(),
        doctorid: formData.doctorid.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        experience: formData.experience.trim(),
        qualification: formData.qualification.trim(),
        bio: formData.bio.trim(),
        rating:
          formData.rating === ""
            ? 0
            : Number(formData.rating),
        consultationFee: Number(
          formData.consultationFee
        ),
        available: Boolean(formData.available),
      };

      if (editMode) {
        await DoctorService.updateDoctor(
          selectedDoctorId,
          doctorData,
          selectedImage,
          galleryImages
        );

        alert("Doctor updated successfully.");
      } else {
        await DoctorService.createDoctor(
          doctorData,
          selectedImage,
          galleryImages
        );

        alert("Doctor added successfully.");
      }

      await loadDoctors();
      closeModal();
    } catch (error) {
      console.error("Doctor save error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to save doctor."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE DOCTOR
  // =====================================================

  const handleDeleteDoctor = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);

      await DoctorService.deleteDoctor(id);

      alert("Doctor deleted successfully.");

      await loadDoctors();
    } catch (error) {
      console.error("Delete doctor error:", error);

      alert(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to delete doctor."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedDoctorId(null);

    setSelectedImage(null);
    setPreviewImage("");

    setGalleryImages([]);
    setGalleryPreviews([]);
    setExistingGallery([]);
    setDeletedGalleryIds([]);

    setFormData({
      ...EMPTY_FORM,
    });
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredDoctors = doctors.filter((doctor) => {
    const text = search.toLowerCase().trim();

    if (!text) return true;

    return (
      doctor.doctorname
        ?.toLowerCase()
        .includes(text) ||
      doctor.doctorid
        ?.toLowerCase()
        .includes(text) ||
      doctor.department
        ?.toLowerCase()
        .includes(text) ||
      doctor.email
        ?.toLowerCase()
        .includes(text)
    );
  });

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalDoctors = doctors.length;

  const availableDoctors = doctors.filter(
    (doctor) => doctor.available === true
  ).length;

  const unavailableDoctors = doctors.filter(
    (doctor) => doctor.available === false
  ).length;

  const departments = new Set(
    doctors
      .map((doctor) => doctor.department)
      .filter(Boolean)
  ).size;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="min-h-full bg-gray-100 p-4 sm:p-5 md:p-6">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Doctors
              </h1>

              <p className="text-gray-500 mt-1">
                Manage hospital doctors
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddDoctor}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              + Add New Doctor
            </button>
          </div>

          {/* =================================================
              STATISTICS
          ================================================= */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <div className="bg-white rounded-xl border p-4">
              <p className="text-xs text-gray-500">
                Total Doctors
              </p>
              <p className="text-2xl font-bold mt-1">
                {totalDoctors}
              </p>
            </div>

            <div className="bg-white rounded-xl border p-4">
              <p className="text-xs text-gray-500">
                Available
              </p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {availableDoctors}
              </p>
            </div>

            <div className="bg-white rounded-xl border p-4">
              <p className="text-xs text-gray-500">
                Unavailable
              </p>
              <p className="text-2xl font-bold text-gray-500 mt-1">
                {unavailableDoctors}
              </p>
            </div>

            <div className="bg-white rounded-xl border p-4">
              <p className="text-xs text-gray-500">
                Departments
              </p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {departments}
              </p>
            </div>
          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="bg-white rounded-xl border p-3 mb-5">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search doctor, ID, department or email..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* =================================================
              DOCTORS
          ================================================= */}

          {loading ? (
            <div className="bg-white rounded-xl p-10 text-center">
              <div className="w-9 h-9 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="mt-3 text-gray-500">
                Loading doctors...
              </p>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="bg-white rounded-xl p-10 text-center">
              <div className="text-4xl mb-3">
                👨‍⚕️
              </div>

              <h2 className="font-bold text-gray-800">
                No Doctors Found
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                Add a new doctor to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            doctor.imageUrl ||
                            "https://via.placeholder.com/80"
                          }
                          alt={doctor.doctorname}
                          className="w-16 h-16 rounded-full object-cover border-2 border-cyan-100"
                        />

                        <span
                          className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                            doctor.available
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="text-base font-bold text-gray-900 truncate">
                          {doctor.doctorname}
                        </h2>

                        <p className="text-cyan-600 text-sm font-medium">
                          {doctor.department}
                        </p>

                        <p className="text-xs text-gray-400">
                          ID: {doctor.doctorid}
                        </p>
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="mt-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          doctor.available
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            doctor.available
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }`}
                        />

                        {doctor.available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>

                    {/* Information */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-[11px] text-gray-400">
                          Experience
                        </p>

                        <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">
                          {doctor.experience || "N/A"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-[11px] text-gray-400">
                          Rating
                        </p>

                        <p className="text-sm font-semibold text-gray-800 mt-0.5">
                          ⭐ {doctor.rating ?? "N/A"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-[11px] text-gray-400">
                          Qualification
                        </p>

                        <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">
                          {doctor.qualification || "N/A"}
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-2.5">
                        <p className="text-[11px] text-gray-400">
                          Consultation
                        </p>

                        <p className="text-sm font-bold text-green-600 mt-0.5">
                          ₹
                          {doctor.consultationFee ??
                            doctor.consultation_fee ??
                            0}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="mt-3">
                      <p className="text-[11px] text-gray-400">
                        Email
                      </p>

                      <p className="text-sm text-gray-700 truncate">
                        {doctor.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="border-t bg-gray-50 p-3 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/doctor/${doctor.id}`
                        )
                      }
                      className="py-2 bg-cyan-100 text-cyan-700 rounded-lg text-sm font-semibold hover:bg-cyan-200"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleEditDoctor(doctor)
                      }
                      className="py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteDoctor(
                          doctor.id
                        )
                      }
                      className="py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

    {/* =====================================================
        ADD / EDIT MODAL
    ===================================================== */}

    {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 md:p-5">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-20 bg-white border-b px-5 md:px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {editMode
                    ? "Edit Doctor"
                    : "Add New Doctor"}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Enter complete doctor information
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-900 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 md:p-6 space-y-6"
            >
              {/* =================================================
                  PROFILE + GALLERY
              ================================================= */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Profile Image */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Doctor Profile Image
                  </h3>

                  <div className="flex items-center gap-5">
                    <div className="flex-shrink-0">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Doctor Profile"
                          className="w-28 h-28 rounded-full object-cover border-4 border-cyan-100"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
                          👨‍⚕️
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="cursor-pointer inline-block bg-cyan-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-cyan-700">
                        Choose Image

                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>

                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG or WEBP. Maximum 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Gallery */}
                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-800">
                      Doctor Gallery Images
                    </h3>

                    <p className="text-xs text-gray-500 mt-1">
                      These images are separate from the profile image.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Existing Gallery */}
                    {existingGallery.map((image) => (
                      <div
                        key={image.id}
                        className="relative"
                      >
                        <img
                          src={image.imageUrl}
                          alt="Doctor gallery"
                          className="w-full h-24 object-cover rounded-lg border"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeExistingGalleryImage(
                              image
                            )
                          }
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {/* New Gallery */}
                    {galleryPreviews.map(
                      (image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="relative"
                        >
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeNewGalleryImage(
                                index
                              )
                            }
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-sm font-bold hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      )
                    )}

                    {/* Add Gallery */}
                    <label className="h-24 border-2 border-dashed border-cyan-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-cyan-50 transition">
                      <span className="text-2xl text-cyan-600">
                        +
                      </span>

                      <span className="text-xs font-semibold text-cyan-600">
                        Add Gallery
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    JPG, PNG or WEBP. Maximum 5MB each.
                  </p>
                </div>
              </div>

              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <div>
                <h3 className="font-bold text-gray-800 mb-4">
                  Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Doctor Name *
                    </label>

                    <input
                      type="text"
                      name="doctorname"
                      value={formData.doctorname}
                      onChange={handleChange}
                      placeholder="Dr. Nur Alam Mondal"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                      required
                    />
                  </div>

                  {/* Doctor ID */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Doctor ID *
                    </label>

                    <input
                      type="text"
                      name="doctorid"
                      value={formData.doctorid}
                      onChange={handleChange}
                      placeholder="DOC001"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="doctor@gmail.com"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  PROFESSIONAL INFORMATION
              ================================================= */}

              <div>
                <h3 className="font-bold text-gray-800 mb-4">
                  Professional Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Department */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Department *
                    </label>

                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                      required
                    >
                      <option value="">
                        Select Department
                      </option>

                      {DEPARTMENTS.map(
                        (department) => (
                          <option
                            key={department}
                            value={department}
                          >
                            {department}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Experience *
                    </label>

                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="10 Years"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                      required
                    />
                  </div>

                  {/* Qualification */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Qualification *
                    </label>

                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      placeholder="MBBS, MD Neurology"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                      required
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating
                    </label>

                    <input
                      type="number"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                      placeholder="4.8"
                      min="0"
                      max="5"
                      step="0.1"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                    />
                  </div>

                  {/* Consultation Fee */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Consultation Fee *
                    </label>

                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="consultationFee"
                        value={
                          formData.consultationFee
                        }
                        onChange={handleChange}
                        placeholder="500"
                        min="0"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-8 focus:ring-2 focus:ring-cyan-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Available */}
                  <div className="flex items-center">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="available"
                        checked={formData.available}
                        onChange={handleChange}
                        className="w-5 h-5 accent-cyan-600"
                      />

                      <div>
                        <p className="font-semibold text-gray-800">
                          Doctor Available
                        </p>

                        <p className="text-xs text-gray-500">
                          Doctor can accept appointments
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* =================================================
                  BIO
              ================================================= */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  About Doctor
                </label>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Write a short description about the doctor..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 resize-none focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editMode
                    ? "Update Doctor"
                    : "Add Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
    )}

    </main>
  );
}

export default Doctor;
