import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "./ui/PageHeader";
import { FormField, inputClass } from "./ui/FormField";

const Settings = () => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully!");
    setPassword("");
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account preferences" />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 space-y-5"
      >
        <FormField label="Change Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className={inputClass}
          />
        </FormField>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
