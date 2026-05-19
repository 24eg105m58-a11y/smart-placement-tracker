import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CompanyDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyWebsite: "",
    companyLocation: "",
    companyType: "",
    companyDescription: "",
    hrName: "",
    hrPhone: "",
    hrLinkedIn: "",
    companyLogo: null,
  });

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setFormData((prev) => ({
      ...prev,

      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);

      // API CALL HERE

      toast.success("Company Details Saved");

      navigate("/recruiter/dashboard");
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
          <h1 className="text-3xl font-bold text-gray-800">Company Details</h1>

          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Complete your company profile to start recruitment drives and manage
            applicants efficiently.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Company Name
            </label>

            <input
              type="text"
              name="companyName"
              id="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Google"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Company Email */}
          <div>
            <label
              htmlFor="companyEmail"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Company Email
            </label>

            <input
              type="email"
              name="companyEmail"
              id="companyEmail"
              value={formData.companyEmail}
              onChange={handleChange}
              placeholder="hr@company.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Company Website */}
          <div>
            <label
              htmlFor="companyWebsite"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Company Website
            </label>

            <input
              type="url"
              name="companyWebsite"
              id="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              placeholder="https://company.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Company Location */}
          <div>
            <label
              htmlFor="companyLocation"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Company Location
            </label>

            <input
              type="text"
              name="companyLocation"
              id="companyLocation"
              value={formData.companyLocation}
              onChange={handleChange}
              placeholder="Hyderabad"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Company Type */}
          <div>
            <label
              htmlFor="companyType"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Company Type
            </label>

            <select
              name="companyType"
              id="companyType"
              value={formData.companyType}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">Select Type</option>

              <option value="Product Based">Product Based</option>

              <option value="Service Based">Service Based</option>

              <option value="Startup">Startup</option>
            </select>
          </div>

          {/* HR Name */}
          <div>
            <label
              htmlFor="hrName"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              HR Name
            </label>

            <input
              type="text"
              name="hrName"
              id="hrName"
              value={formData.hrName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* HR Phone */}
          <div>
            <label
              htmlFor="hrPhone"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              HR Phone
            </label>

            <input
              type="tel"
              name="hrPhone"
              id="hrPhone"
              value={formData.hrPhone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* HR LinkedIn */}
          <div>
            <label
              htmlFor="hrLinkedIn"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              HR LinkedIn
            </label>

            <input
              type="url"
              name="hrLinkedIn"
              id="hrLinkedIn"
              value={formData.hrLinkedIn}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/hr"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Company Description */}
          <div className="md:col-span-2">
            <label
              htmlFor="companyDescription"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Company Description
            </label>

            <textarea
              rows="4"
              name="companyDescription"
              id="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              placeholder="Describe your company..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Company Logo */}
          <div className="md:col-span-2">
            <label
              htmlFor="companyLogo"
              className="block mb-1 text-sm font-semibold text-gray-700"
            >
              Company Logo
            </label>

            <input
              type="file"
              name="companyLogo"
              id="companyLogo"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm cursor-pointer file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-blue-500 file:text-white file:rounded-lg hover:file:bg-blue-600"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              Save Company Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyDetails;
