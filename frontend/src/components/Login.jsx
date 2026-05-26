import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/user-api/login",

        formData,

        {
          withCredentials: true,
        },
      );

      console.log(response.data);

      toast.success("Login Successful");

      const role = response.data?.payload?.role;

      localStorage.setItem("token", response.data.token || "logged");

      if (role === "STUDENT") {
        navigate("/student/student-dashboard");
      } else if (role === "RECRUITER") {
        navigate("/recruiter/dashboard/company-details");
      } else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.log(err);

      toast.error(err?.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-5">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-semibold">Email</label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              "
            />
          </div>

          <div>
            <label className="font-semibold">Password</label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              "
            />
          </div>

          <NavLink
            to="/register"
            className="
            text-sm
            text-blue-600
            "
          >
            Don't have account?
          </NavLink>

          <button
            type="submit"
            className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-xl
            "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
