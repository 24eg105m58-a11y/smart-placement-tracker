import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { getFullName } from "../../utils/userSession";
import StatCard from "../ui/StatCard";
import StatusBadge from "../ui/StatusBadge";
import ChartCard from "../ui/ChartCard";
import AIInsights from "../student/AIInsights";
const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState({
    upcomingDrives: [],
    appliedCompanies: [],
    interviews: [],
    placementStatus: "Loading",
    eligibilityPercentage: 0,
    profileCompletion: 0,
    notifications: [],
    resume: null,
  });
  const [aiInsights, setAiInsights] = useState({
    insightSummary: "",
    tips: [],
  });
  const {
    upcomingDrives,
    appliedCompanies,
    interviews,
    placementStatus,
    eligibilityPercentage,
    profileCompletion,
    notifications,
    // resume,
  } = dashboard;

  useEffect(() => {
    api
      .get("/user-api/profile")
      .then((res) => setUser(res.data.payload))
      .catch(() => {});
    api
      .get("/student-api/dashboard")
      .then((res) =>
        setDashboard((prev) => ({ ...prev, ...(res.data.payload || {}) })),
      )
      .catch(() => {});

    api
      .get("/student-api/ai-insights")
      .then((res) => {
        setAiInsights({
          insightSummary: res.data.payload?.insightSummary || "",
          tips: res.data.payload?.tips || [],
        });
      })
      .catch(() => {});
  }, []);

  const fullName =
    getFullName(user) || localStorage.getItem("userName") || "there";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl text-white p-6 sm:p-8 shadow-lg shadow-sky-200 animate-fade-in-left hover-lift">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hello, {fullName} 👋
          </h1>
          <p className="mt-2 text-sky-100">Welcome back to CareerCanopy.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-medium">
              Status: {placementStatus}
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-medium">
              Eligibility: {eligibilityPercentage}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-sky-100 p-6 flex flex-col items-center justify-center animate-scale-in animation-delay-200 hover-lift">
          <h2 className="font-semibold text-slate-700 self-start mb-4">
            Profile Completion
          </h2>
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#2563eb"
                strokeWidth="8"
                strokeDasharray={`${profileCompletion * 2.64} 264`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-sky-700">
              {profileCompletion}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Upcoming Drives"
          value={upcomingDrives.length}
          icon="📅"
          color="slate"
        />
        <StatCard
          title="Applications"
          value={appliedCompanies.length}
          icon="📋"
          color="blue"
        />
        <StatCard
          title="Interviews"
          value={interviews.filter((i) => i.status === "Scheduled").length}
          icon="🎯"
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2">
          <ChartCard title="Upcoming Drives">
            <div className="space-y-3 h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {upcomingDrives.map((drive) => (
                <div
                  key={drive.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-smooth hover:-translate-y-0.5 ${
                    drive.applied
                      ? "bg-emerald-50 border-emerald-200 shadow-sm"
                      : "bg-stone-50 border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 overflow-hidden rounded-xl border border-stone-200 bg-white flex items-center justify-center text-xs font-semibold text-stone-500 shrink-0">
                      {drive.companyLogo ? (
                        <img
                          src={drive.companyLogo}
                          alt={drive.company}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        drive.company
                          .split(" ")
                          .filter(Boolean)
                          .map((part) => part[0])
                          .slice(0, 2)
                          .join("")
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="font-medium text-stone-800 text-sm truncate">
                        {drive.driveName}
                      </p>
                      <p className="text-xs text-stone-500 truncate">
                        {drive.company} · {drive.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <StatusBadge status={drive.status} />
                    {drive.applied && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        Applied
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* <div className="space-y-4 sm:space-y-6">
          <ChartCard title="My Resume">
            {resume ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-lg shrink-0">
                    📄
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 text-sm truncate">
                      {resume.fileName}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ATS Score: {resume.atsScore ?? 0}/100
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        resume.resumeUrl,
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-center transition-colors"
                  >
                    View
                  </button>
                  <Link
                    to="/student/student-dashboard/resume"
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-center transition-colors"
                  >
                    Manage
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-gray-400">No resume uploaded yet</p>
                <Link
                  to="/student/student-dashboard/resume"
                  className="inline-flex px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Upload Resume
                </Link>
              </div>
            )}
          </ChartCard>

          <ChartCard title="Recent Notifications">
            <div className="space-y-3">
              {notifications.slice(0, 4).map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl ${n.read ? "bg-stone-50" : "bg-amber-50 border border-amber-100"}`}
                >
                  <p className="font-medium text-sm text-stone-800">
                    {n.title}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-stone-400 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div> */}
        <div>
          <ChartCard title="Recent Notifications">
            <div className="space-y-3 h-[420px] overflow-y-auto pr-2 custom-scrollbar">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-xl ${
                    n.read
                      ? "bg-stone-50"
                      : "bg-amber-50 border border-amber-100"
                  }`}
                >
                  <p className="font-medium text-sm text-stone-800">
                    {n.title}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-stone-400 mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Applied Companies">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100">
                {["Company", "Role", "Applied On", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appliedCompanies.map((app, i) => (
                <tr key={i}>
                  <td className="px-3 py-3 text-sm font-medium">
                    {app.company}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600">
                    {app.role}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-600">
                    {app.appliedOn}
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {aiInsights.insightSummary && (
        <ChartCard title="AI Placement Coach Insights">
          <div className="flex flex-col gap-4">
            <div className="p-5 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/60 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🤖</span>
                <h4 className="font-bold text-slate-800 text-sm md:text-base">
                  Coach Recommendation
                </h4>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {aiInsights.insightSummary}
              </p>

              {aiInsights.tips?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {aiInsights.tips.slice(0, 3).map((tip, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-blue-100 px-3 py-1 rounded-full text-xs text-slate-600 font-medium"
                    >
                      {tip}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Link
                to="/student/student-dashboard/ai-insights"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-all"
              >
                Detailed Insights
              </Link>
            </div>
          </div>
        </ChartCard>
      )}
    </div>
  );
};

export default StudentDashboard;
