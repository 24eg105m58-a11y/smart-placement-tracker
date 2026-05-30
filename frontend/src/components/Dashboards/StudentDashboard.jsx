import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "../ui/StatCard";
import StatusBadge from "../ui/StatusBadge";
import ChartCard from "../ui/ChartCard";
import { studentDashboardData } from "@tempData";

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const { upcomingDrives, appliedCompanies, interviews, placementStatus, eligibilityPercentage, profileCompletion, notifications } =
    studentDashboardData;

  useEffect(() => {
    axios
      .get("http://localhost:5000/user-api/profile", { withCredentials: true })
      .then((res) => setUser(res.data.payload))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white p-6 sm:p-8 shadow-lg shadow-blue-200">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Hello, {user?.firstname || "Student"} 👋
          </h1>
          <p className="mt-2 text-blue-100">Welcome back to Smart Placement Tracker.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-medium">
              Status: {placementStatus}
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-medium">
              Eligibility: {eligibilityPercentage}%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
          <h2 className="font-semibold text-gray-700 self-start mb-4">Profile Completion</h2>
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
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
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-blue-600">
              {profileCompletion}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard title="Upcoming Drives" value={upcomingDrives.length} icon="📅" color="blue" />
        <StatCard title="Applications" value={appliedCompanies.length} icon="📋" color="purple" />
        <StatCard title="Interviews" value={interviews.filter((i) => i.status === "Scheduled").length} icon="🎯" color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <ChartCard title="Upcoming Drives">
          <div className="space-y-3">
            {upcomingDrives.slice(0, 4).map((drive) => (
              <div key={drive.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{drive.driveName}</p>
                  <p className="text-xs text-gray-500">{drive.company} · {drive.date}</p>
                </div>
                <StatusBadge status={drive.status} />
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Recent Notifications">
          <div className="space-y-3">
            {notifications.slice(0, 4).map((n) => (
              <div key={n.id} className={`p-3 rounded-xl ${n.read ? "bg-gray-50" : "bg-blue-50 border border-blue-100"}`}>
                <p className="font-medium text-sm text-gray-800">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
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
                  <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {appliedCompanies.map((app, i) => (
                <tr key={i}>
                  <td className="px-3 py-3 text-sm font-medium">{app.company}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{app.role}</td>
                  <td className="px-3 py-3 text-sm text-gray-600">{app.appliedOn}</td>
                  <td className="px-3 py-3"><StatusBadge status={app.status} /></td>
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
