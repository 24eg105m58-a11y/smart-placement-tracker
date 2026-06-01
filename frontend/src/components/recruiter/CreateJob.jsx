import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../ui/PageHeader";
import { FormField, inputClass, textareaClass, FormActions } from "../ui/FormField";
import api from "../../api/client";
import { jobBranchOptions } from "../../constants/placementOptions";

const CreateJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: localStorage.getItem("companyName") || "",
    package: "",
    role: "",
    description: "",
    minCgpa: "",
    branches: [],
    lastDate: "",
    interviewDate: "",
  });

  useEffect(() => {
    api
      .get("/company-api/get-companyDetails")
      .then((res) => {
        const company = res.data.payload;
        if (company?.companyName) {
          setForm((prev) => ({ ...prev, companyName: company.companyName }));
        } else {
          return api.get("/user-api/profile");
        }
      })
      .then((res) => {
        if (res?.data?.payload?.companyName) {
          setForm((prev) => ({
            ...prev,
            companyName: prev.companyName || res.data.payload.companyName,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.branches.length === 0) {
      toast.error("Please select at least one branch");
      return;
    }

    try {
      await api.post("/company-api/job-postings", form);
      toast.success("Job posting created successfully!");
      navigate("/recruiter/recruiter-dashboard/jobs", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create job");
    }
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
          <div className="rounded-xl border border-gray-200 bg-white p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {jobBranchOptions.map((branch) => {
              const checked = form.branches.includes(branch.value);
              return (
                <label
                  key={branch.value}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    checked
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      setForm((prev) => {
                        const next = new Set(prev.branches);
                        if (branch.value === "ANY") {
                          if (next.has("ANY")) {
                            next.delete("ANY");
                          } else {
                            next.clear();
                            next.add("ANY");
                          }
                          return { ...prev, branches: Array.from(next) };
                        }

                        if (next.has(branch.value)) {
                          next.delete(branch.value);
                        } else {
                          next.add(branch.value);
                        }

                        if (next.has("ANY")) {
                          next.delete("ANY");
                        }

                        return { ...prev, branches: Array.from(next) };
                      })
                    }
                    className="h-4 w-4 accent-blue-500"
                  />
                  <span className="leading-5">{branch.label}</span>
                </label>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Select one or more branches. Current selection: {form.branches.length}
          </p>
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
