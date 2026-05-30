import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../ui/PageHeader";
import { FormField, inputClass, textareaClass } from "../ui/FormField";
import { institutionSettings } from "@tempData";

const AdminSettings = () => {
  const [form, setForm] = useState({ ...institutionSettings });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully!");
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure institution details and preferences" />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-5 max-w-2xl"
      >
        <FormField label="Institution Name">
          <input className={inputClass} name="institutionName" value={form.institutionName} onChange={handleChange} />
        </FormField>
        <FormField label="Contact Email">
          <input type="email" className={inputClass} name="contactEmail" value={form.contactEmail} onChange={handleChange} />
        </FormField>
        <FormField label="Contact Phone">
          <input className={inputClass} name="contactPhone" value={form.contactPhone} onChange={handleChange} />
        </FormField>
        <FormField label="Address">
          <textarea rows={3} className={textareaClass} name="address" value={form.address} onChange={handleChange} />
        </FormField>
        <FormField label="Logo">
          <input
            type="file"
            accept="image/*"
            className="w-full border border-gray-200 rounded-xl p-2 text-sm file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-lg"
          />
        </FormField>
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
