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
  // OTP
  // ==========================================

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // ==========================================
  // UI STATES
  // ==========================================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

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

  // ==========================================
  // SEND OTP
  // ==========================================

  const handleSendOtp = async () => {
    const passwordRules = validatePassword(
      formData.password
    );

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
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      alert("Passwords do not match!");
      return;
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert(
        "Please enter a valid 10-digit phone number."
      );
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

    const userData = {
      hospitalName:
        formData.hospitalName.trim(),

      adminName:
        formData.adminName.trim(),

      email:
        formData.email.trim(),

      phone:
        formData.phone.trim(),

      password:
        formData.password,
    };

    try {
      setOtpLoading(true);

      await AuthService.sendRegisterOtp(userData);

      setOtpSent(true);

      alert(
        `OTP has been sent to ${userData.email}`
      );

    } catch (error) {

      if (error.response) {
        const status =
          error.response.status;

        const data =
          error.response.data;

        let message =
          "Failed to send OTP.";

        if (typeof data === "string") {
          message = data;
        } else if (data?.message) {
          message = data.message;
        } else if (data?.error) {
          message = data.error;
        }

        if (status === 409) {
          alert(
            "Email already registered. Please use another email."
          );
        }

        else if (status === 401) {
          alert(
            "Unauthorized request."
          );
        }

        else if (status === 403) {
          alert(
            "You don't have permission to perform this action."
          );
        }

        else if (status >= 500) {
          alert(
            "Server error. Please make sure UserMs, GatewayMs and Email service are running correctly."
          );
        }

        else {
          alert(message);
        }
      }

      else if (error.request) {
        alert(
          "Server is not responding. Please make sure GatewayMs and UserMs are running."
        );
      }

      else {
        alert(
          "Failed to send OTP. Please try again."
        );
      }

    } finally {
      setOtpLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      alert(
        "OTP must contain 6 digits."
      );
      return;
    }

    try {
      setLoading(true);

      await AuthService.verifyRegisterOtp(
        formData.email.trim(),
        otp.trim()
      );

      alert(
        "Account registered successfully!"
      );

      navigate("/login");

    } catch (error) {

      if (error.response) {
        const status =
          error.response.status;

        const data =
          error.response.data;

        let message =
          "OTP verification failed.";

        if (typeof data === "string") {
          message = data;
        }

        else if (data?.message) {
          message = data.message;
        }

        else if (data?.error) {
          message = data.error;
        }

        if (status === 400) {
          alert(
            "Invalid or expired OTP. Please try again."
          );
        }

        else if (status === 409) {
          alert(
            "Email already registered."
          );
        }

        else if (status >= 500) {
          alert(
            "Server error. Please try again."
          );
        }

        else {
          alert(message);
        }
      }

      else if (error.request) {
        alert(
          "Server is not responding. Please make sure GatewayMs and UserMs are running."
        );
      }

      else {
        alert(
          "OTP verification failed. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PASSWORD RULES
  // ==========================================

  const passwordRules =
    validatePassword(
      formData.password
    );

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-1">

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
            onSubmit={(e) => {
              e.preventDefault();

              if (!otpSent) {
                handleSendOtp();
              } else {
                handleVerifyOtp(e);
              }
            }}
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
                disabled={otpSent}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600 disabled:bg-slate-100"
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
                disabled={otpSent}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600 disabled:bg-slate-100"
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
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  }}
  placeholder="Enter phone number"
  required
  inputMode="numeric"
  maxLength={10}
  disabled={otpSent}
  className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600 disabled:bg-slate-100"
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
                disabled={otpSent}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600 disabled:bg-slate-100"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create strong password"
                  required
                  minLength={8}
                  disabled={otpSent}
                  className="w-full px-4 py-2 pr-16 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600 disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={otpSent}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-cyan-700 font-semibold"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              {/* PASSWORD RULES */}

              {formData.password &&
                !otpSent && (
                  <div className="mt-2 text-xs space-y-0.5">

                    <p
                      className={
                        passwordRules.length
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {passwordRules.length
                        ? "✓"
                        : "✗"}{" "}
                      At least 8 characters
                    </p>

                    <p
                      className={
                        passwordRules.uppercase
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {passwordRules.uppercase
                        ? "✓"
                        : "✗"}{" "}
                      One uppercase letter
                    </p>

                    <p
                      className={
                        passwordRules.lowercase
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {passwordRules.lowercase
                        ? "✓"
                        : "✗"}{" "}
                      One lowercase letter
                    </p>

                    <p
                      className={
                        passwordRules.number
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {passwordRules.number
                        ? "✓"
                        : "✗"}{" "}
                      One number
                    </p>

                    <p
                      className={
                        passwordRules.special
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {passwordRules.special
                        ? "✓"
                        : "✗"}{" "}
                      One special character
                    </p>

                    <p
                      className={
                        passwordRules.noSpace
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {passwordRules.noSpace
                        ? "✓"
                        : "✗"}{" "}
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
                  value={
                    formData.confirmPassword
                  }
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                  minLength={8}
                  disabled={otpSent}
                  className="w-full px-4 py-2 pr-16 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-cyan-600 disabled:bg-slate-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  disabled={otpSent}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-cyan-700 font-semibold"
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              {/* PASSWORD MATCH */}

              {formData.confirmPassword &&
                !otpSent && (
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

            {/* OTP SECTION */}

            {otpSent && (
              <div className="md:col-span-2">

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">

                  <div className="text-sm text-slate-600">

                    <p>
                      We sent a 6-digit OTP to:
                    </p>

                    <p className="font-semibold text-cyan-600 mt-1">
                      {formData.email}
                    </p>

                  </div>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    placeholder="Enter 6-digit OTP"
                    className="w-60 mx-auto block mt-3 px-4 py-2.5 border-2 border-slate-300 rounded-xl outline-none bg-white text-center text-xl font-semibold text-slate-600 transition-all duration-200 focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100 placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal"
                  />

                </div>

              </div>
            )}

            {/* TERMS */}

            {!otpSent && (
              <div className="md:col-span-2">

                <label className="flex items-start gap-2 text-sm text-slate-600">

                  <input
                    type="checkbox"
                    required
                    className="mt-1"
                  />

                  <span>
                    I agree to the Terms &
                    Conditions and Privacy Policy.
                  </span>

                </label>

              </div>
            )}

            {/* BUTTON */}

            <div className="md:col-span-2 flex justify-center">

              {!otpSent ? (

                <button
                  type="submit"
                  disabled={otpLoading}
                  className={`w-full text-white font-semibold py-2.5 rounded-lg transition duration-200 ${
                    otpLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-cyan-700 hover:bg-cyan-800"
                  }`}
                >
                  {otpLoading
                    ? "Sending OTP..."
                    : "Send OTP →"}
                </button>

              ) : (

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full md:w-96 text-white font-semibold py-2.5 rounded-lg transition duration-200 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {loading
                    ? "Verifying..."
                    : "Verify OTP & Create Account"}
                </button>

              )}

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