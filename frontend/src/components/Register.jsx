import React, { useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons
import api from "../api/client";
import { storeUserSession } from "../utils/userSession";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "student",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    companyName: "",
    profileImage: null,
  });

  // State to control password visibility
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = new FormData();

      userData.append("firstname", formData.firstname);
      userData.append("lastname", formData.lastname);
      userData.append("email", formData.email);
      userData.append("password", formData.password);
      userData.append("role", formData.role.toUpperCase());

      if (formData.role === "recruiter" && formData.companyName) {
        userData.append("companyName", formData.companyName);
      }

      if (formData.profileImage) {
        userData.append("profileImageUrl", formData.profileImage);
      }

      userData.append("isUserActive", true);

      const response = await api.post("/user-api/register", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(response.data.message || "Registration successful!");

      storeUserSession(response.data.payload);

      const role = response.data?.payload?.role;

      if (role === "STUDENT") {
        navigate("/student/academic-details");
      } else if (role === "RECRUITER") {
        navigate("/recruiter/company-details");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-12 animate-fade-in">
      <div className="w-full max-w-xl bg-white shadow-md rounded-xl p-8 animate-scale-in hover-lift">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 animate-slide-down">
          Register / Signup
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 animate-fade-in-up animation-delay-200"
        >
          {/* Role */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Role
            </label>

            <div className="flex gap-4 text-sm">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={formData.role === "student"}
                  onChange={handleChange}
                  className="accent-blue-500 h-4 w-4"
                />
                <span>Student</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={formData.role === "recruiter"}
                  onChange={handleChange}
                  className="accent-blue-500 h-4 w-4"
                />
                <span>Recruiter</span>
              </label>
            </div>
          </div>

          {formData.role === "recruiter" && (
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Your company name"
                required
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Firstname
              </label>

              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First name"
                required
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Lastname
              </label>

              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last name"
                required
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-semibold text-gray-700">
                Password
              </label>

              {/* Password field with absolute toggle button */}
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  className="w-full text-sm border border-gray-300 rounded-lg pl-3 pr-10 py-1.5 outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block mb-1 text-sm font-semibold text-gray-700">
              Profile Image
            </label>

            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-xs border border-gray-300 rounded-lg p-1 cursor-pointer file:mr-3 file:px-3 file:py-1 file:border-0 file:bg-blue-500 file:text-white file:rounded file:text-xs hover:file:bg-blue-600"
            />
          </div>

          {/* Login Link */}
          <div className="text-right">
            <NavLink
              to="/login"
              className="text-xs text-blue-500 hover:underline font-medium"
            >
              Already have an account? Log in
            </NavLink>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-smooth text-sm mt-2 btn-press hover:shadow-lg hover:shadow-blue-200"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
