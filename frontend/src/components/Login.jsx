import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons
import api from "../api/client";
import { storeUserSession } from "../utils/userSession";
import LoginPromoPanel from "./LoginPromoPanel";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  // State to control password visibility
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      const response = await api.post("/user-api/login", {
        email: formData.email,
        password: formData.password,
      });

      toast.success("Login Successful");
      storeUserSession(response.data.payload);
      const role = response.data?.payload?.role;

      if (role === "STUDENT") navigate("/student/student-dashboard");
      else if (role === "RECRUITER") navigate("/recruiter/recruiter-dashboard");
      else if (role === "ADMIN") navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex">
      <LoginPromoPanel />

      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 sm:p-10 animate-fade-in-right">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8 animate-slide-down">
            <p className="text-xl font-extrabold text-slate-900">SMART</p>
            <p className="text-xs font-semibold text-blue-500 tracking-[0.2em]">
              PLACEMENT TRACKER
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-100 animate-scale-in animation-delay-200 hover-lift">
            <h2 className="text-2xl font-bold text-gray-900 mb-1 animate-fade-in-up animation-delay-300">
              Welcome back
            </h2>
            <p className="text-gray-500 text-sm mb-6 animate-fade-in-up animation-delay-400">
              Sign in to your account
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 animate-fade-in-up animation-delay-500"
            >
              <div className="transition-smooth focus-within:translate-x-0.5">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@college.edu"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth"
                />
              </div>

              <div className="transition-smooth">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                {/* Relative container handles the inner positioning of the eye icon button */}
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-smooth"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm animate-fade-in animation-delay-600">
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
                <a
                  href="#"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-smooth btn-press hover:shadow-lg hover:shadow-blue-200 animate-fade-in-up animation-delay-700"
              >
                Login
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6 animate-fade-in animation-delay-800">
              Don't have an account?{" "}
              <NavLink
                to="/register"
                className="text-blue-600 font-semibold hover:underline"
              >
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
