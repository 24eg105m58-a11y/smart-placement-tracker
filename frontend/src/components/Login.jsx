import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/user-api/login",
        { email: formData.email, password: formData.password },
        { withCredentials: true },
      );

      toast.success("Login Successful");
      const role = response.data?.payload?.role;
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", role);

      if (role === "STUDENT") navigate("/student/student-dashboard");
      else if (role === "RECRUITER") navigate("/recruiter/recruiter-dashboard");
      else if (role === "ADMIN") navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h1 className="text-4xl font-bold mb-4">Smart Placement Tracker</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            Streamline campus recruitment for students, recruiters, and placement officers.
          </p>
          <div className="mt-10 flex justify-center">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center text-7xl">
              🎓
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-600">Smart Placement</h1>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@college.edu"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 accent-blue-600 rounded"
                  />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:underline font-medium">Forgot password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <NavLink to="/register" className="text-blue-600 font-semibold hover:underline">
                Sign up
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
