import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../ui/PageHeader";
import { FormField, inputClass } from "../ui/FormField";

const AdminProfile = () => {
  const [form, setForm] = useState({
    fullName: "Admin User",
    email: "admin@college.edu",
    phone: "+91 9876543210",
    role: "Admin",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader title="Profile" subtitle="Manage your account information" />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-6"
      >
        <div className="flex flex-col items-center pb-6 border-b border-gray-100">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
            A
          </div>
          <button type="button" className="mt-3 text-sm text-blue-600 hover:underline font-medium">
            Change Photo
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Full Name">
            <input className={inputClass} name="fullName" value={form.fullName} onChange={handleChange} />
          </FormField>
          <FormField label="Email Address">
            <input type="email" className={inputClass} name="email" value={form.email} onChange={handleChange} />
          </FormField>
          <FormField label="Phone Number">
            <input className={inputClass} name="phone" value={form.phone} onChange={handleChange} />
          </FormField>
          <FormField label="Role">
            <input className={`${inputClass} bg-gray-50`} name="role" value={form.role} readOnly />
          </FormField>
        </div>

        <FormField label="Password">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              className={inputClass}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
            <button type="button" className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 shrink-0">
              Change Password
            </button>
          </div>
        </FormField>

        <div className="flex justify-end pt-2">
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
