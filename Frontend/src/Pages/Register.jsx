import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../Services/authService";

const Register = () => {
  const navigate = useNavigate();

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    hospitalName: "",
    adminName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // ==========================================
  // UI STATES
  // ==========================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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
  // PASSWORD VALIDATION
  // ==========================================

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@$!%*?&]/.test(password),
      noSpace: !/\s/.test(password),
    };
  };

  const passwordRules = validatePassword(formData.password);

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    // Password validation
    if (
      !passwordRules.length ||
      !passwordRules.uppercase ||
      !passwordRules.lowercase ||
      !passwordRules.number ||
      !passwordRules.special ||
      !passwordRules.noSpace
    ) {
      alert(
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, one special character, and no spaces."
      );
      return;
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // Required fields
    if (
      !formData.hospitalName.trim() ||
      !formData.adminName.trim() ||
      !formData.email.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    // Data sent to backend
    const userData = {
      hospitalName: formData.hospitalName.trim(),
      adminName: formData.adminName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      password: formData.password,
    };

    try {
      setLoading(true);

      // Direct registration
      await AuthService.register(userData);

      alert("Account registered successfully!");

      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 409) {
          alert(
            "Email already registered. Please use another email."
          );
        } else if (status === 400) {
          alert(
            typeof data === "string"
              ? data
              : data?.message || "Invalid registration data."
          );
        } else if (status === 401) {
          alert("Unauthorized request.");
        } else if (status === 403) {
          alert("You don't have permission to perform this action.");
        } else if (status >= 500) {
          alert(
            "Server error. Please make sure UserMs and GatewayMs are running correctly."
          );
        } else {
          alert(
            typeof data === "string"
              ? data
              : data?.message || "Registration failed."
          );
        }
      } else if (error.request) {
        alert(
          "Server is not responding. Please make sure GatewayMs and UserMs are running."
        );
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-6">

      <div className="w-full max-w-2xl">

        {/* HEADER */}

        <div className="text-center mb-4">

          <div className="text-4xl mb-2">
            🏥
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Hospital Management
          </h1>

          <p className="text-slate-500 mt-1 text-sm">
            Hospital Management & Information System
          </p>

        </div>

        {/* CARD */}

        <div className="bg-white rounded-2xl shadow-xl p-5">

          {/* TITLE */}

          <div className="mb-4">

            <p className="text-sm uppercase tracking-widest text-cyan-700 font-semibold">
              Hospital Registration
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-1">
              Create Account
            </h2>

            <p className="text-slate-500 mt-1 text-sm">
              Register your hospital administrator
              account to start managing your hospital.
            </p>

          </div>

          {/* FORM */}

          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >

            {/* HOSPITAL NAME */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Hospital Name
              </label>

              <input
                type="text"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                placeholder="Enter hospital name"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600"
              />

            </div>

            {/* ADMIN NAME */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Administrator Name
              </label>

              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                placeholder="Enter administrator name"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600"
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  setFormData((prev) => ({
                    ...prev,
                    phone: value,
                  }));
                }}
                placeholder="Enter phone number"
                required
                inputMode="numeric"
                maxLength={10}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600"
              />

            </div>

            {/* EMAIL */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hospital@example.com"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password
              </label>

              <div className="relative">

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create strong password"
                  required
                  minLength={8}
                  className="w-full px-4 py-2 pr-16 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-cyan-700 font-semibold"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

              {/* PASSWORD RULES */}

              {formData.password && (
                <div className="mt-2 text-xs space-y-0.5">

                  <p
                    className={
                      passwordRules.length
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {passwordRules.length ? "✓" : "✗"}{" "}
                    At least 8 characters
                  </p>

                  <p
                    className={
                      passwordRules.uppercase
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {passwordRules.uppercase ? "✓" : "✗"}{" "}
                    One uppercase letter
                  </p>

                  <p
                    className={
                      passwordRules.lowercase
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {passwordRules.lowercase ? "✓" : "✗"}{" "}
                    One lowercase letter
                  </p>

                  <p
                    className={
                      passwordRules.number
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {passwordRules.number ? "✓" : "✗"}{" "}
                    One number
                  </p>

                  <p
                    className={
                      passwordRules.special
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {passwordRules.special ? "✓" : "✗"}{" "}
                    One special character
                  </p>

                  <p
                    className={
                      passwordRules.noSpace
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {passwordRules.noSpace ? "✓" : "✗"}{" "}
                    No spaces
                  </p>

                </div>
              )}

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  minLength={8}
                  className="w-full px-4 py-2 pr-16 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-cyan-700 font-semibold"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>

              </div>

              {/* PASSWORD MATCH */}

              {formData.confirmPassword && (
                <p
                  className={`text-xs mt-1 ${
                    formData.password ===
                    formData.confirmPassword
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {formData.password ===
                  formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}

            </div>

            {/* TERMS */}

            <div className="md:col-span-2">

              <label className="flex items-start gap-2 text-sm text-slate-600">

                <input
                  type="checkbox"
                  required
                  className="mt-1"
                />

                <span>
                  I agree to the Terms & Conditions
                  and Privacy Policy.
                </span>

              </label>

            </div>

            {/* BUTTON */}

            <div className="md:col-span-2 flex justify-center">

              <button
                type="submit"
                disabled={loading}
                className={`w-full md:w-96 text-white font-semibold py-2.5 rounded-lg transition duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-cyan-700 hover:bg-cyan-800"
                }`}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account →"}
              </button>

            </div>

          </form>

          {/* LOGIN */}

          <div className="text-center mt-4 pt-4 border-t border-slate-200">

            <p className="text-slate-500 text-sm">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="inline-block mt-1 text-cyan-700 font-bold hover:underline"
            >
              Hospital Login →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;