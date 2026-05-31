import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../ui/PageHeader";
import { FormField, inputClass, selectClass, textareaClass, FormActions } from "../ui/FormField";
import { branches, batches } from "../../constants/placementOptions";

const AddStudent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    rollNo: "",
    name: "",
    email: "",
    phone: "",
    branch: "",
    batch: "",
    cgpa: "",
    dob: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Student saved successfully!");
    navigate("/admin/dashboard/students");
  };

  return (
    <div>
      <PageHeader title="Add Student" subtitle="Register a new student in the placement system" />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <FormField label="Roll Number">
          <input className={inputClass} name="rollNo" value={form.rollNo} onChange={handleChange} required />
        </FormField>
        <FormField label="Full Name">
          <input className={inputClass} name="name" value={form.name} onChange={handleChange} required />
        </FormField>
        <FormField label="Email Address">
          <input type="email" className={inputClass} name="email" value={form.email} onChange={handleChange} required />
        </FormField>
        <FormField label="Phone Number">
          <input className={inputClass} name="phone" value={form.phone} onChange={handleChange} required />
        </FormField>
        <FormField label="Branch">
          <select className={selectClass} name="branch" value={form.branch} onChange={handleChange} required>
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Batch">
          <select className={selectClass} name="batch" value={form.batch} onChange={handleChange} required>
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </FormField>
        <FormField label="CGPA">
          <input type="number" step="0.01" min="0" max="10" className={inputClass} name="cgpa" value={form.cgpa} onChange={handleChange} required />
        </FormField>
        <FormField label="Date of Birth">
          <input type="date" className={inputClass} name="dob" value={form.dob} onChange={handleChange} required />
        </FormField>
        <FormField label="Address" fullWidth>
          <textarea rows={3} className={textareaClass} name="address" value={form.address} onChange={handleChange} required />
        </FormField>
        <FormActions onCancel={() => navigate("/admin/dashboard/students")} submitLabel="Save Student" />
      </form>
    </div>
  );
};

export default AddStudent;
