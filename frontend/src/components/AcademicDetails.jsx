import React, { useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router";

const AcademicDetails = () => {
  const [formData, setFormData] = useState({
    rollNumber: "",
    branch: "",
    cgpa: "",
    graduationYear: "",
    noBacklogs: true,
    resume: null,
    linkedIn: "",
    github: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);

      toast.success("Academic Details Submitted");
      // API CALL HERE
      navigate("/student/student-dashboard");
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-6 md:p-8">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Academic Details</h1>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Complete your academic profile to unlock placement applications and
            eligibility tracking.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Roll Number */}
          <div>
            <label
              htmlFor="rollNumber"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Roll Number
            </label>

            <input
              type="text"
              name="rollNumber"
              id="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              placeholder="24EG105M58"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Branch */}
          <div>
            <label
              htmlFor="branch"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Branch
            </label>

            <select
              name="branch"
              id="branch"
              value={formData.branch}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Select Branch</option>

              <option value="CSE">Computer Science Engineering (CSE)</option>

              <option value="CSM">Computer Science & AI/ML (CSM)</option>

              <option value="CSD">Computer Science & Data Science (CSD)</option>

              <option value="CSC">
                Computer Science & Cyber Security (CSC)
              </option>

              <option value="IT">Information Technology (IT)</option>

              <option value="ECE">
                Electronics & Communication Engineering (ECE)
              </option>

              <option value="EEE">
                Electrical & Electronics Engineering (EEE)
              </option>

              <option value="MECH">Mechanical Engineering</option>

              <option value="CIVIL">Civil Engineering</option>

              <option value="CHEM">Chemical Engineering</option>

              <option value="AERO">Aeronautical Engineering</option>

              <option value="AUTO">Automobile Engineering</option>

              <option value="MINING">Mining Engineering</option>

              <option value="BIOTECH">Biotechnology Engineering</option>

              <option value="AGRI">Agricultural Engineering</option>

              <option value="PETRO">Petroleum Engineering</option>

              <option value="METALLURGY">Metallurgical Engineering</option>

              <option value="TEXTILE">Textile Engineering</option>
            </select>
          </div>

          {/* CGPA */}
          <div>
            <label
              htmlFor="cgpa"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              CGPA
            </label>

            <input
              type="number"
              step="0.01"
              min="0"
              max="10"
              name="cgpa"
              id="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              placeholder="8.2"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Graduation Year */}
          <div>
            <label
              htmlFor="graduationYear"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Graduation Year
            </label>

            <input
              type="number"
              name="graduationYear"
              id="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              placeholder="2028"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label
              htmlFor="linkedIn"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              LinkedIn Profile
            </label>

            <input
              type="url"
              name="linkedIn"
              id="linkedIn"
              value={formData.linkedIn}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* GitHub */}
          <div>
            <label
              htmlFor="github"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              GitHub Profile
            </label>

            <input
              type="url"
              name="github"
              id="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Resume Upload */}
          <div className="md:col-span-2">
            <label
              htmlFor="resume"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Resume Upload
            </label>

            <input
              type="file"
              name="resume"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm cursor-pointer file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-blue-500 file:text-white file:rounded-lg hover:file:bg-blue-600"
            />
          </div>

          {/* Backlogs */}
          <div className="md:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              name="noBacklogs"
              id="noBacklogs"
              checked={formData.noBacklogs}
              onChange={handleChange}
              className="h-4 w-4 accent-blue-500"
            />

            <label
              htmlFor="noBacklogs"
              className="text-sm font-medium text-gray-700"
            >
              No Active Backlogs
            </label>
          </div>

          {/* Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              Save Academic Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AcademicDetails;
