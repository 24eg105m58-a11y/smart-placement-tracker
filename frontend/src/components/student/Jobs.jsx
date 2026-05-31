import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/client";
import PageHeader from "../ui/PageHeader";
import StatusBadge from "../ui/StatusBadge";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [applyingJobId, setApplyingJobId] = useState(null);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/student-api/get-jobs");
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
  }, []);

  const applyToJob = async (job) => {
    setApplyingJobId(job.id);
    try {
      await api.post("/student-api/job-application", { jobId: job.id });
      toast.success("Application submitted successfully");
      await loadJobs();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to apply");
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Jobs"
        subtitle="Browse live drives, review your eligibility, and apply before the deadline"
        action={
          <Link
            to="/student/student-dashboard/applications"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            View Applications
          </Link>
        }
      />

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          Loading jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400 space-y-3">
          <p>No jobs are open right now.</p>
          <Link
            to="/student/student-dashboard/academic-profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            Check academic profile
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {jobs.map((job) => {
            const canApply = job.eligible && !job.alreadyApplied;
            const expanded = expandedJobId === job.id;

            return (
              <div key={job.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.driveName}</h3>
                    <p className="text-sm text-gray-500 mt-1">{job.company}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Package</p>
                    <p className="font-medium text-gray-900 mt-1">{job.package}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Apply until</p>
                    <p className="font-medium text-gray-900 mt-1">{job.lastDateToApply || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Minimum CGPA</p>
                    <p className="font-medium text-gray-900 mt-1">{job.minimumCGPA}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Eligible Branches</p>
                    <p className="font-medium text-gray-900 mt-1">{job.eligibleBranches || "-"}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className={`text-sm font-medium ${job.eligible ? "text-green-700" : "text-amber-700"}`}>
                    {job.eligibilityNote}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {job.alreadyApplied ? "You have already applied for this job." : "Review the details before applying."}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedJobId(expanded ? null : job.id)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
                  >
                    {expanded ? "Hide Details" : "View Details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => applyToJob(job)}
                    disabled={!canApply || applyingJobId === job.id}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {job.alreadyApplied
                      ? "Applied"
                      : applyingJobId === job.id
                        ? "Applying..."
                        : "Apply Now"}
                  </button>
                </div>

                {expanded && (
                  <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-700 space-y-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Job Role</p>
                      <p className="mt-1 font-medium text-gray-900">{job.role}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Location</p>
                      <p className="mt-1">{job.location || "On campus"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Description</p>
                      <p className="mt-1 leading-6 whitespace-pre-line">{job.description || "No description provided."}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Jobs;
