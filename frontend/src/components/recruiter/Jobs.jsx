import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/client";
import PageHeader from "../ui/PageHeader";
import StatusBadge from "../ui/StatusBadge";
import { FormField, inputClass, textareaClass, FormActions } from "../ui/FormField";
import { jobBranchOptions } from "../../constants/placementOptions";

const emptyForm = {
  companyName: localStorage.getItem("companyName") || "",
  package: "",
  role: "",
  description: "",
  minCgpa: "",
  branches: [],
  lastDate: "",
  interviewDate: "",
  location: "",
};

const canEditJob = (job) => true;
const dayMs = 24 * 60 * 60 * 1000;

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingJobId, setEditingJobId] = useState(null);
  const [applicantsJob, setApplicantsJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/company-api/jobs");
      setJobs(res.data.payload || []);
    } catch (error) {
      console.log(error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();

    api
      .get("/company-api/get-companyDetails")
      .then((res) => {
        const company = res.data.payload;
        if (company?.companyName) {
          setForm((prev) => ({ ...prev, companyName: company.companyName }));
          localStorage.setItem("companyName", company.companyName);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingJobId(null);
    setForm((prev) => ({
      ...emptyForm,
      companyName: prev.companyName || emptyForm.companyName,
    }));
  };

  const submitJob = async (e) => {
    e.preventDefault();

    if (form.branches.length === 0) {
      toast.error("Please select at least one branch");
      return;
    }

    try {
      const payload = {
        ...form,
        branches: form.branches,
      };

      if (editingJobId) {
        await api.patch(`/company-api/jobs/${editingJobId}`, payload);
        toast.success("Job updated successfully");
      } else {
        await api.post("/company-api/job-postings", payload);
        toast.success("Job created successfully");
      }

      navigate("/recruiter/recruiter-dashboard/jobs", { replace: true });
      resetForm();
      await loadJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save job");
    }
  };

  const startEdit = (job) => {
    if (!canEditJob(job)) {
      toast.error("This job is locked and can no longer be edited");
      return;
    }

    setEditingJobId(job.id);
    setForm({
      companyName: job.company || "",
      package: job.package || "",
      role: job.role || job.driveName || "",
      description: job.description || "",
      minCgpa: job.minimumCGPA ?? "",
      branches: job.eligibleBranches
        ? job.eligibleBranches === "Any Branch"
          ? ["ANY"]
          : job.eligibleBranches.split(",").map((branch) => branch.trim()).filter(Boolean)
        : [],
      lastDate: job.lastDateToApply || "",
      interviewDate: job.date || "",
      location: job.location || "",
    });
  };

  const deleteJob = async (job) => {
    if (!canEditJob(job)) {
      toast.error("This job is locked and can no longer be deleted");
      return;
    }

    try {
      await api.delete(`/company-api/jobs/${job.id}`);
      toast.success("Job deleted successfully");
      await loadJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to delete job");
    }
  };

  const viewApplicants = async (job) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setApplicantsJob(job);
    setApplicantsLoading(true);
    try {
      const res = await api.get(`/company-api/jobs/${job.id}/applicants`);
      setApplicants(res.data.payload || []);
    } catch (error) {
      console.log(error);
      setApplicants([]);
      toast.error(error?.response?.data?.message || "Unable to load applicants");
    } finally {
      setApplicantsLoading(false);
    }
  };

  const closeApplicants = () => {
    setApplicantsJob(null);
    setApplicants([]);
  };

  const getUrgency = (job) => {
    const dates = [job.lastDateToApply, job.date]
      .filter(Boolean)
      .map((value) => new Date(value))
      .filter((date) => !Number.isNaN(date.getTime()));

    if (dates.length === 0) {
      return null;
    }

    const deadline = new Date(Math.min(...dates.map((date) => date.getTime())));
    const diff = deadline.getTime() - Date.now();

    if (diff < 0) {
      return { tone: "overdue", label: "Expired" };
    }

    if (diff <= dayMs) {
      return { tone: "critical", label: "Expires in 24h" };
    }

    if (diff <= dayMs * 2) {
      return { tone: "warning", label: "Expires in 2 days" };
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        subtitle="Create, edit, postpone, delete, and review applicants for your drives"
        action={
          editingJobId ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel Edit
            </button>
          ) : null
        }
      />

      <form
        onSubmit={submitJob}
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
        <FormField label="Location">
          <input className={inputClass} name="location" value={form.location} onChange={handleChange} placeholder="On campus" />
        </FormField>
        <FormField label="Job Description" fullWidth>
          <textarea rows={4} className={textareaClass} name="description" value={form.description} onChange={handleChange} required />
        </FormField>
        <FormActions
          onCancel={editingJobId ? resetForm : undefined}
          submitLabel={editingJobId ? "Update Job" : "Create Job"}
        />
      </form>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-gray-800">My Jobs</h3>
            <p className="text-sm text-gray-500">Manage every job you have posted</p>
          </div>
          <span className="text-sm text-gray-500">{jobs.length} jobs</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No jobs posted yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead>
                <tr className="bg-gray-50">
                  {["Role", "Company", "Apply Until", "Interview", "Applicants", "Status", "Actions"].map((head) => (
                    <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {jobs.map((job) => {
                  const urgency = getUrgency(job);

                  return (
                    <tr
                      key={job.id}
                      className={`transition-colors ${urgency ? "bg-amber-50/70" : "hover:bg-gray-50/80"}`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-800">{job.driveName}</div>
                          {urgency && (
                            <span
                              className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                                urgency.tone === "critical"
                                  ? "bg-red-100 text-red-700"
                                  : urgency.tone === "warning"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-200 text-slate-700"
                              }`}
                            >
                              {urgency.label}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">{job.location || "On campus"}</div>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{job.company}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{job.lastDateToApply || "-"}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{job.date || "-"}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">{job.applicantCount || 0}</td>
                      <td className="px-4 py-3.5">
                        <div className="space-y-1">
                          <StatusBadge status={job.status} />
                          {job.locked && <p className="text-xs text-amber-600">Locked</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => viewApplicants(job)}
                            className="px-3 py-2 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          >
                            View Applicants
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(job)}
                            disabled={!canEditJob(job)}
                            className="px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteJob(job)}
                            disabled={!canEditJob(job)}
                            className="px-3 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {applicantsJob && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-4 sm:py-6">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-sky-600 font-semibold">Applicants List</p>
                <h3 className="mt-2 text-xl font-bold text-slate-900">
                  {applicantsJob.driveName}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{applicantsJob.company}</p>
              </div>
              <button
                type="button"
                onClick={closeApplicants}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="p-5 sm:p-6">
              {applicantsLoading ? (
                <div className="py-12 text-center text-gray-400">Loading applicants...</div>
              ) : applicants.length === 0 ? (
                <div className="py-12 text-center text-gray-400">No applicants yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr className="bg-gray-50">
                        {["Name", "Email", "CGPA", "Branch", "Status", "Applied On"].map((head) => (
                          <th key={head} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                            {head}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {applicants.map((app) => (
                        <tr key={app.id}>
                          <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{app.name}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-600">{app.email || "-"}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-600">{app.cgpa}</td>
                          <td className="px-4 py-3.5 text-sm text-gray-600">{app.branch}</td>
                          <td className="px-4 py-3.5">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-600">{app.appliedOn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
