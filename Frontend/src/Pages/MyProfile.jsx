import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  User,
  Mail,
  Phone,
  Lock,
  GraduationCap,
  Building2,
  ShieldCheck,
  Save,
  Eye,
  EyeOff,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


function MyProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    adminName: "",
    email: "",
    phone: "",
    hospitalName: "",
    hospitalId: "",
    role: "Hospital Administrator",
  });

  const [formData, setFormData] = useState({
    adminName: "",
    email: "",
    phone: "",
    hospitalName: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const adminName =
      localStorage.getItem("adminName") || "";

    const email =
      localStorage.getItem("email") || "";

    const phone =
      localStorage.getItem("phone") ||
      localStorage.getItem("mobile") ||
      "";

    const hospitalName =
      localStorage.getItem("hospitalName") || "";

    const hospitalId =
      localStorage.getItem("hospitalId") || "";

    const savedProfileImage =
      localStorage.getItem("profileImage") || "";

    const data = {
      adminName,
      email,
      phone,
      hospitalName,
      hospitalId,
      role: "Hospital Administrator",
    };

    setProfile(data);

    setFormData({
      adminName,
      email,
      phone,
      hospitalName,
      newPassword: "",
      confirmPassword: "",
    });

    setProfileImage(savedProfileImage);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG or GIF image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Maximum image size is 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;

      setProfileImage(image);
      localStorage.setItem(
        "profileImage",
        image
      );
    };

    reader.readAsDataURL(file);
  };

  const getInitial = () => {
    return (
      profile.adminName?.trim()?.charAt(0)?.toUpperCase() ||
      "A"
    );
  };

  const handleSave = () => {
    const adminName =
      formData.adminName.trim();

    const email =
      formData.email.trim();

    const phone =
      formData.phone.trim();

    const hospitalName =
      formData.hospitalName.trim();

    if (!adminName) {
      alert("Full name is required.");
      return;
    }

    if (!email) {
      alert("Email address is required.");
      return;
    }

    if (!hospitalName) {
      alert("Hospital name is required.");
      return;
    }

    if (
      formData.newPassword &&
      formData.newPassword.length < 6
    ) {
      alert(
        "New password must contain at least 6 characters."
      );
      return;
    }

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match.");
      return;
    }

    localStorage.setItem(
      "adminName",
      adminName
    );

    localStorage.setItem(
      "email",
      email
    );

    localStorage.setItem(
      "phone",
      phone
    );

    localStorage.setItem(
      "hospitalName",
      hospitalName
    );

    setProfile((prev) => ({
      ...prev,
      adminName,
      email,
      phone,
      hospitalName,
    }));

    setFormData((prev) => ({
      ...prev,
      newPassword: "",
      confirmPassword: "",
    }));

    alert("Profile changes saved successfully.");
  };

  return (
    <main className="min-h-full bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">My Profile</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your profile information</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-gray-100">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#0b3573] text-4xl font-bold text-white">
                    {getInitial()}
                  </div>
                )}
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-800">{profile.adminName || "Admin"}</h2>
              <p className="mt-1 text-sm text-gray-500">Hospital Administrator</p>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0b3573] px-4 py-3 text-sm font-semibold text-white hover:bg-[#08295b]"
              >
                <Camera size={17} /> Change Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <div className="mt-6 space-y-4 border-t pt-6">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Email</p>
                <p className="mt-1 break-all text-sm font-medium text-gray-700">{profile.email || "Not available"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Phone</p>
                <p className="mt-1 text-sm font-medium text-gray-700">{profile.phone || "Not available"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-400">Hospital</p>
                <p className="mt-1 text-sm font-medium text-gray-700">{profile.hospitalName || "Not available"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-6 text-xl font-bold text-[#0b3573]">Profile Details</h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="adminName" value={formData.adminName} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Phone</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">Hospital Name</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-6">
              <h3 className="text-base font-bold text-[#0b3573]">Change Password</h3>
              <p className="mt-1 mb-5 text-sm text-gray-400">Leave blank if you do not want to change your password.</p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">New Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showNewPassword ? "text" : "password"} name="newPassword"
                      value={formData.newPassword} onChange={handleChange} placeholder="Enter new password"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-11 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    <button type="button" onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">Confirm Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                      value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm new password"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-11 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
                    <button type="button" onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button type="button" onClick={handleSave}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0b3573] py-3 font-semibold text-white hover:bg-[#08295b]">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default MyProfile;
