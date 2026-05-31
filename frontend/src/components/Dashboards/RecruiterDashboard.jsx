import { useEffect, useState } from "react";
import api from "../../api/client";
import StatCard from "../ui/StatCard";
import DataTable from "../ui/DataTable";
import ChartCard from "../ui/ChartCard";
import { getFullName } from "../../utils/userSession";

const applicantColumns = [
  { key: "name", label: "Name" },
  { key: "drive", label: "Drive" },
  { key: "cgpa", label: "CGPA" },
  { key: "branch", label: "Branch" },
  { key: "status", label: "Status", type: "status" },
];

const RecruiterDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboard, setDashboard] = useState({
    activeJobs: 0,
    totalApplicants: 0,
    scheduledInterviews: 0,
    recentApplicants: [],
  });
  const { activeJobs, totalApplicants, scheduledInterviews, recentApplicants } = dashboard;

  useEffect(() => {
    api.get("/user-api/profile").then((res) => setUser(res.data.payload)).catch(() => {});
    api.get("/company-api/dashboard")
      .then((res) => setDashboard((prev) => ({ ...prev, ...(res.data.payload || {}) })))
      .catch(() => {});
  }, []);

  const fullName = getFullName(user) || localStorage.getItem("userName") || "there";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl text-white p-6 sm:p-8 shadow-lg shadow-blue-200 animate-fade-in-left hover-lift">
        <h1 className="text-2xl sm:text-3xl font-bold">Hello, {fullName} 👋</h1>
        <p className="mt-2 text-blue-100">Manage your job postings and applicants from here.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatCard title="Active Jobs" value={activeJobs} icon="💼" color="blue" />
        <StatCard title="Total Applicants" value={totalApplicants} icon="👥" color="purple" />
        <StatCard title="Scheduled Interviews" value={scheduledInterviews} icon="🎯" color="orange" />
      </div>

      <ChartCard title="Recent Applicants">
        <DataTable
          columns={applicantColumns}
          data={recentApplicants.map((a, i) => ({ ...a, id: i }))}
          searchable={false}
          actions={false}
        />
      </ChartCard>
    </div>
  );
};

export default RecruiterDashboard;
