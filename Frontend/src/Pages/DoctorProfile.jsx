import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AxiosInterceptor from "../Interceptor/AxiosInterceptor.jsx";

function DoctorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  const hospitalName =
    localStorage.getItem("hospitalName") || "Hospital";

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await AxiosInterceptor.get(`/doctor/${id}`);

      console.log("Doctor Profile:", response.data);
      setDoctor(response.data);
    } catch (err) {
      console.error("Failed to fetch doctor:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to load doctor profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const profileImage =
    doctor?.imageUrl ||
    doctor?.image ||
    "https://via.placeholder.com/180";

  const galleryImages = Array.isArray(doctor?.galleryImages)
    ? doctor.galleryImages
    : [];

  const consultationFee =
    doctor?.consultationFee ??
    doctor?.consultation_fee ??
    0;

  const rating = doctor?.rating ?? 0;
  const experience = doctor?.experience || "N/A";
  const qualification =
    doctor?.qualification || "Qualification not available";

  const bio =
    doctor?.bio ||
    `Dr. ${
      doctor?.doctorname || "Doctor"
    } is a professional medical specialist providing quality healthcare and patient-centred treatment.`;

  const getGalleryUrl = (image) =>
    image?.imageUrl || image?.url || image;

  const goToAppointments = () => {
    navigate("/appointments");
  };

  if (loading) {
    return (
      <main className="min-h-full bg-slate-50">
        <div className="min-h-[75vh] flex items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading doctor profile...
              </p>
            </div>
          </div>
      </main>
    );
  }

  if (error || !doctor) {
    return (
      <main className="min-h-full bg-slate-50 p-4 md:p-6">
            <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-3xl">
                ⚠️
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Doctor Not Found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                {error || "Unable to load this doctor profile."}
              </p>

              <button
                type="button"
                onClick={() => navigate("/doctor")}
                className="mt-6 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-600/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
              >
                Back to Doctors
              </button>
            </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-full bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1500px]">
          {/* =========================
              HERO / DOCTOR HEADER
          ========================== */}
          <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500" />

            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-teal-50 blur-2xl" />
            <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-cyan-50 blur-3xl" />

            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
                  {/* Profile image */}
                  <div className="relative mx-auto shrink-0 sm:mx-0">
                    <div className="rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 p-1 shadow-xl shadow-teal-500/15">
                      <img
                        src={profileImage}
                        alt={doctor.doctorname}
                        className="h-28 w-28 rounded-full border-4 border-white object-cover sm:h-32 sm:w-32"
                      />
                    </div>

                    <span
                      className={`absolute bottom-2 right-1 h-7 w-7 rounded-full border-4 border-white ${
                        doctor.available
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                  </div>

                  {/* Doctor information */}
                  <div className="min-w-0 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                        {doctor.doctorname}
                      </h1>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          doctor.available
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                            : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                        }`}
                      >
                        {doctor.available ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <p className="mt-2 text-base font-bold text-teal-600">
                      {doctor.department || "Medical Department"}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Doctor ID:{" "}
                      <span className="font-semibold text-slate-700">
                        {doctor.doctorid || "N/A"}
                      </span>
                    </p>

                    <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
                      {bio}
                    </p>

                    <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                      <div className="rounded-xl bg-amber-50 px-3 py-2 text-sm ring-1 ring-amber-100">
                        <span className="text-amber-500">★</span>
                        <span className="ml-1 text-slate-500">Rating</span>
                        <span className="ml-1 font-bold text-slate-900">
                          {rating}
                        </span>
                      </div>

                      <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm ring-1 ring-slate-200">
                        <span className="text-slate-500">Experience</span>
                        <span className="ml-1 font-bold text-slate-900">
                          {experience}
                        </span>
                      </div>

                      <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm ring-1 ring-emerald-100">
                        <span className="text-slate-500">Consultation</span>
                        <span className="ml-1 font-bold text-emerald-600">
                          ₹{consultationFee}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full flex-col gap-3 xl:w-56">
                  <button
                    type="button"
                    onClick={goToAppointments}
                    className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700"
                  >
                    📅 Book Appointment
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/doctors")}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                  >
                    ← Back to Doctor List
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* =========================
              MAIN GRID
          ========================== */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* LEFT / MAIN CONTENT */}
            <div className="space-y-6 xl:col-span-2">
              {/* About */}
              <section
                id="overview"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-lg">
                    👨‍⚕️
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      About Doctor
                    </h2>
                    <p className="text-xs text-slate-400">
                      Professional overview
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-slate-600">
                  {bio}
                </p>

                <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Doctor ID
                    </p>
                    <p className="mt-2 truncate font-bold text-slate-900">
                      {doctor.doctorid || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Experience
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {experience}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-400">
                      Department
                    </p>
                    <p className="mt-2 truncate font-bold text-slate-900">
                      {doctor.department || "N/A"}
                    </p>
                  </div>

                  <div
                    className={`rounded-2xl border p-4 ${
                      doctor.available
                        ? "border-emerald-100 bg-emerald-50"
                        : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <p className="text-xs font-medium text-slate-400">
                      Status
                    </p>
                    <p
                      className={`mt-2 font-bold ${
                        doctor.available
                          ? "text-emerald-600"
                          : "text-slate-600"
                      }`}
                    >
                      {doctor.available ? "Available" : "Unavailable"}
                    </p>
                  </div>
                </div>
              </section>

              {/* Education */}
              <section
                id="education"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-lg">
                    🎓
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Education / Qualification
                    </h2>
                    <p className="text-xs text-slate-400">
                      Medical education
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-cyan-100 bg-gradient-to-r from-cyan-50 to-teal-50 p-5">
                  <p className="text-lg font-bold text-teal-800">
                    {qualification}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Medical Qualification
                  </p>
                </div>
              </section>

              {/* Professional Experience */}
              <section
                id="experience"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                    💼
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Professional Experience
                    </h2>
                    <p className="text-xs text-slate-400">
                      Clinical experience
                    </p>
                  </div>
                </div>

                <div className="relative mt-6 border-l-2 border-teal-100 pl-6">
                  <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-teal-500 ring-4 ring-teal-50" />

                  <p className="font-bold text-slate-900">
                    {experience}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-teal-600">
                    {doctor.department || "Medical Department"}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Clinical experience in{" "}
                    {doctor.department || "medical care"}.
                  </p>
                </div>
              </section>

              {/* Workplace */}
              <section
                id="workplace"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-lg">
                    🏥
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Workplace
                    </h2>
                    <p className="text-xs text-slate-400">
                      Current hospital
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <p className="font-bold text-slate-900">
                    {hospitalName}
                  </p>

                  <p className="mt-1 text-sm font-medium text-teal-600">
                    {doctor.department || "Medical Department"}
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Doctor ID: {doctor.doctorid || "N/A"}
                  </p>
                </div>
              </section>

              {/* Gallery */}
              <section
                id="gallery"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 text-lg">
                      🖼️
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Doctor Gallery
                      </h2>
                      <p className="text-xs text-slate-400">
                        Professional photos
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                    {galleryImages.length}{" "}
                    {galleryImages.length === 1 ? "image" : "images"}
                  </span>
                </div>

                {galleryImages.length === 0 ? (
                  <div className="mt-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
                    <div className="text-4xl">🖼️</div>
                    <p className="mt-3 text-sm font-medium text-slate-500">
                      No gallery images added yet.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {galleryImages.map((image, index) => {
                      const imageUrl = getGalleryUrl(image);

                      return (
                        <button
                          type="button"
                          key={
                            image?.id ||
                            `${imageUrl}-${index}`
                          }
                          onClick={() =>
                            setSelectedGalleryImage(imageUrl)
                          }
                          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <img
                            src={imageUrl}
                            alt={`Doctor gallery ${index + 1}`}
                            className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                          />

                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 to-transparent p-3 pt-10 opacity-0 transition group-hover:opacity-100">
                            <p className="text-xs font-semibold text-white">
                              View image
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Reviews */}
              <section
                id="reviews"
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-lg">
                    ⭐
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Reviews
                    </h2>
                    <p className="text-xs text-slate-400">
                      Doctor rating
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-5 rounded-2xl bg-slate-50 p-5 sm:flex-row sm:items-center">
                  <div className="min-w-28">
                    <p className="text-4xl font-extrabold text-slate-900">
                      {rating}
                    </p>

                    <p className="mt-1 tracking-widest text-amber-400">
                      ★★★★★
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Doctor Rating
                    </p>
                  </div>

                  <p className="text-sm leading-6 text-slate-500">
                    Patient reviews and feedback will appear here.
                  </p>
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
              {/* Contact */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-lg">
                    📞
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Contact Information
                    </h2>
                    <p className="text-xs text-slate-400">
                      Doctor contact details
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Email
                    </p>
                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {doctor.email || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Phone
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {doctor.phone || "Not available"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Department
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {doctor.department || "Not available"}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Availability
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          doctor.available
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />

                      <p
                        className={`text-sm font-bold ${
                          doctor.available
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        {doctor.available
                          ? "Currently Available"
                          : "Currently Unavailable"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Fee */}
              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <p className="text-sm font-bold text-slate-800">
                  Consultation Fee
                </p>

                <div className="mt-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
                  <p className="text-3xl font-extrabold text-emerald-600">
                    ₹{consultationFee}
                  </p>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Consultation charge
                  </p>
                </div>
              </section>

              {/* Appointment CTA */}
              <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 p-6 text-white shadow-xl shadow-orange-500/15">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl backdrop-blur">
                  📅
                </div>

                <h2 className="mt-5 text-xl font-extrabold">
                  Need an Appointment?
                </h2>

                <p className="mt-2 text-sm leading-6 text-orange-50">
                  Schedule an appointment with{" "}
                  <span className="font-bold text-white">
                    {doctor.doctorname}
                  </span>
                  .
                </p>

                <button
                  type="button"
                  onClick={goToAppointments}
                  className="mt-5 w-full rounded-xl bg-white py-3.5 text-sm font-bold text-orange-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50"
                >
                  📅 Book Appointment
                </button>
              </section>
            </aside>
          </div>
      </div>
      </main>

      {/* =========================
          GALLERY LIGHTBOX
      ========================== */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-white/20"
          >
            ×
          </button>

          <img
            src={selectedGalleryImage}
            alt="Doctor gallery"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-[95vw] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}

export default DoctorProfile;
