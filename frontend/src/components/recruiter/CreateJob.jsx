import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../ui/PageHeader";
import { FormField, inputClass, selectClass, textareaClass, FormActions } from "../ui/FormField";
import { branches } from "@tempData";

const CreateJob = () => {
  const [form, setForm] = useState({
    companyName: "",
    package: "",
    role: "",
    description: "",
    minCgpa: "",
    branches: "",
    lastDate: "",
    interviewDate: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Job posting created successfully!");
  };

  return (
    <div>
      <PageHeader title="Create Job Posting" subtitle="Set up a new recruitment drive" />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <FormField label="Company Name">
          <input className={inputClass} name="companyName" value={form.companyName} onChange={handleChange} required />
        </FormField>
        <FormField label="Package / CTC">
          <input className={inputClass} name="package" value={form.package} onChange={handleChange} placeholder="e.g. 12 LPA" required />
        </FormField>
        <FormField label="Role">
          <input className={inputClass} name="role" value={form.role} onChange={handleChange} required />
        </FormField>
        <FormField label="Minimum CGPA">
          <input type="number" step="0.01" className={inputClass} name="minCgpa" value={form.minCgpa} onChange={handleChange} required />
        </FormField>
        <FormField label="Allowed Branches">
          <select className={selectClass} name="branches" value={form.branches} onChange={handleChange} required>
            <option value="">Select</option>
            {branches.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Last Application Date">
          <input type="date" className={inputClass} name="lastDate" value={form.lastDate} onChange={handleChange} required />
        </FormField>
        <FormField label="Interview Date">
          <input type="date" className={inputClass} name="interviewDate" value={form.interviewDate} onChange={handleChange} required />
        </FormField>
        <FormField label="Job Description" fullWidth>
          <textarea rows={4} className={textareaClass} name="description" value={form.description} onChange={handleChange} required />
        </FormField>
        <FormActions submitLabel="Create Job Posting" />
      </form>
    </div>
  );
};

export default CreateJob;
