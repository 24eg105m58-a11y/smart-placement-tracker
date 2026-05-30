import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, value);
        }
      });

      const response = await axios.post(
        "http://localhost:5000/company-api/companyDetails",

        data,

        {
          withCredentials: true,

          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(response.data);

      toast.success(response.data.message);

      navigate("/recruiter/recruiter-dashboard");
    } catch (err) {
      console.log("Error Response:", err.response?.data);

      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div
        className="
        max-w-6xl
        mx-auto
        bg-white
        rounded-3xl
        shadow-xl
        p-8
        "
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Company Details</h1>

          <p className="text-gray-500">Setup recruiter profile</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="
          grid
          md:grid-cols-2
          gap-6
          "
        >
          {[
            ["companyName", "Company Name"],

            ["companyEmail", "Company Email"],

            ["companyWebsite", "Company Website"],

            ["companyLocation", "Location"],

            ["hrName", "HR Name"],

            ["hrPhone", "HR Phone"],

            ["hrLinkedIn", "HR LinkedIn"],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="font-medium">{label}</label>

              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="
                  w-full
                  mt-2
                  p-3
                  rounded-xl
                  border
                  "
              />
            </div>
          ))}

          <div>
            <label>Company Type</label>

            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              className="
              w-full
              p-3
              mt-2
              border
              rounded-xl
              "
            >
              <option>Select</option>

              <option>Product Based</option>

              <option>Service Based</option>

              <option>Startup</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label>Description</label>

            <textarea
              rows="5"
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              className="
              w-full
              border
              rounded-xl
              p-3
              mt-2
              "
            />
          </div>

          <div className="md:col-span-2">
            <label>Company Logo</label>

            <input
              type="file"
              name="companyLogo"
              onChange={handleChange}
              className="
              w-full
              mt-2
              border
              p-3
              rounded-xl
              "
            />
          </div>

          <div className="md:col-span-2">
            <button
              className="
              w-full
              bg-blue-600
              text-white
              py-4
              rounded-xl
              "
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
