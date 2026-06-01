import { useEffect, useState } from "react";
import api from "../../api/client";
import { getFullName } from "../../utils/userSession";
import StatCard from "../ui/StatCard";
import StatusBadge from "../ui/StatusBadge";
import ChartCard from "../ui/ChartCard";

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
  });
  const {
    upcomingDrives,
    appliedCompanies,
    interviews,
    placementStatus,
    eligibilityPercentage,
    profileCompletion,
    notifications,
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
  }, []);

  const fullName =
    getFullName(user) || localStorage.getItem("userName") || "there";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-sky-600 to-blue-600 rounded-2xl text-white p-6 sm:p-8 shadow-lg shadow-sky-200 animate-fade-in-left hover-lift">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hello, {fullName} 👋
          </h1>
          <p className="mt-2 text-sky-100">
            Welcome back to CareerCanopy.
          </p>
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="Upcoming Drives">
          <div className="space-y-3">
            {upcomingDrives.slice(0, 4).map((drive) => (
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

        <ChartCard title="Recent Notifications">
          <div className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl ${n.read ? "bg-stone-50" : "bg-amber-50 border border-amber-100"}`}
              >
                <p className="font-medium text-sm text-stone-800">{n.title}</p>
                <p className="text-xs text-stone-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-stone-400 mt-1">{n.time}</p>
              </div>
            ))}
          </div>
        </ChartCard>
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
    </div>
  );
};

export default StudentDashboard;
