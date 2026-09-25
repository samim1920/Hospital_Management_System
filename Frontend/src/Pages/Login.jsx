import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../Services/authService";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    console.log("========== LOGIN ==========");
    console.log("Email:", formData.email);

    try {
      const token = await AuthService.login(formData);

      console.log("✅ Login successful");
      console.log("Token received:", token);

      if (token) {
        navigate("/dashboard");
      } else {
        setError("Login failed. Token was not received.");
      }
    } catch (error) {
      console.error("❌ Login failed:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setError("Invalid email or password.");
        } else {
          setError(
            error.response.data?.message ||
              "Login failed. Please try again."
          );
        }
      } else {
        setError("Unable to connect to server.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏥</div>

          <h1 className="text-3xl font-bold text-slate-800">
            Hospital Management
          </h1>

          <p className="text-slate-500 mt-2">
            Hospital Management & Information System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">

          <div className="mb-6">
            <p className="text-sm uppercase tracking-widest text-cyan-700 font-semibold">
              Authorized Access
            </p>

            <h2 className="text-3xl font-bold text-slate-800 mt-2">
              Hospital Login
            </h2>

            <p className="text-slate-500 mt-2">
              Login to manage patients, doctors, appointments and
              hospital operations.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg
                outline-none focus:ring-2 focus:ring-cyan-600
                focus:border-cyan-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg
                outline-none focus:ring-2 focus:ring-cyan-600
                focus:border-cyan-600"
              />
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" />
                Remember me
              </label>

              <button
                type="button"
                className="text-cyan-700 font-semibold hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-700 hover:bg-cyan-800
              disabled:bg-cyan-400
              text-white font-semibold py-3 rounded-lg
              transition duration-200"
            >
              {loading ? "Logging in..." : "Hospital Login →"}
            </button>

          </form>

          {/* Register */}
          <div className="text-center mt-6 pt-5 border-t border-slate-200">

            <p className="text-slate-500">
              Don't have an account?
            </p>

            <Link
              to="/register"
              className="inline-block mt-2 text-cyan-700
              font-bold hover:underline"
            >
              Create Hospital Account →
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;