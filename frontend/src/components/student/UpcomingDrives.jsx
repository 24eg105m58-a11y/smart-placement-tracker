import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import PageHeader from "../ui/PageHeader";
import StatusBadge from "../ui/StatusBadge";

const dayMs = 24 * 60 * 60 * 1000;

const getUrgency = (job) => {
  const dates = [job.lastDateToApply, job.date]
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()));

  if (dates.length === 0) return null;

  const deadline = new Date(Math.min(...dates.map((date) => date.getTime())));
  const diff = deadline.getTime() - Date.now();

  if (diff < 0) return { tone: "overdue", label: "Expired" };
  if (diff <= dayMs) return { tone: "critical", label: "Expires in 24h" };
  if (diff <= dayMs * 2) return { tone: "warning", label: "Expires in 2 days" };
  return null;
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const UpcomingDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/student-api/get-jobs")
      .then((res) => {
        setDrives(res.data.payload || []);
      })
      .catch(() => setDrives([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upcoming Drives"
        subtitle="Browse active placement drives, check your fit, and see which ones you already applied to"
        action={
          <Link
            to="/student/student-dashboard/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Open Jobs
          </Link>
        }
      />

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          Loading drives...
        </div>
      ) : drives.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          No drives available right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {drives.map((drive) => {
            const urgency = getUrgency(drive);
            const applied = drive.alreadyApplied;

            return (
              <div
                key={drive.id}
                className={`rounded-2xl border p-5 sm:p-6 transition-all duration-300 ${
                  applied
                    ? "border-emerald-200 bg-emerald-50/60 shadow-emerald-100"
                    : urgency
                      ? "border-amber-200 bg-amber-50/70 shadow-amber-100"
                      : "border-gray-100 bg-white hover:border-blue-100 hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-2xl border border-gray-100 bg-white flex items-center justify-center text-sm font-semibold text-gray-500 shadow-sm">
                      {drive.companyLogo ? (
                        <img
                          src={drive.companyLogo}
                          alt={drive.company}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        getInitials(drive.company)
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{drive.driveName}</h3>
                      <p className="text-sm text-gray-500 mt-1">{drive.company}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={drive.status} />
                    {applied && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        Applied
                      </span>
                    )}
                    {!applied && urgency && (
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
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-white/80 p-3 border border-gray-100">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Package</p>
                    <p className="font-medium text-gray-900 mt-1">{drive.package}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 border border-gray-100">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Apply until</p>
                    <p className="font-medium text-gray-900 mt-1">{drive.lastDateToApply || "-"}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 border border-gray-100">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Minimum CGPA</p>
                    <p className="font-medium text-gray-900 mt-1">{drive.minimumCGPA}</p>
                  </div>
                  <div className="rounded-xl bg-white/80 p-3 border border-gray-100">
                    <p className="text-xs uppercase tracking-wide text-gray-400">Eligible Branches</p>
                    <p className="font-medium text-gray-900 mt-1">{drive.eligibleBranches || "-"}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className={`text-sm font-medium ${drive.eligible ? "text-emerald-700" : "text-amber-700"}`}>
                    {drive.eligibilityNote}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {applied
                      ? "You have already applied for this drive."
                      : "Review the details before applying from the Jobs page."}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingDrives;
