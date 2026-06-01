import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import StatCard from "../ui/StatCard";
import ChartCard from "../ui/ChartCard";
import StatusBadge from "../ui/StatusBadge";
import api from "../../api/client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({
    dashboardStats: {
      students: 0,
      companies: 0,
      jobDrives: 0,
      placements: 0,
    },
    placementOverview: [],
    placementStatus: [],
    recentDrives: [],
  });

  useEffect(() => {
    api.get("/admin-api/dashboard").then((res) => {
      setDashboard((prev) => ({ ...prev, ...(res.data.payload || {}) }));
    }).catch(() => {});
  }, []);

  const {
    dashboardStats,
    placementOverview,
    placementStatus,
    recentDrives,
  } = dashboard;

  const lineData = {
    labels: placementOverview.map((d) => d.month),
    datasets: [
      {
        label: "Placed",
        data: placementOverview.map((d) => d.placed),
        borderColor: "#44403c",
        backgroundColor: "rgba(68, 64, 60, 0.08)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Applied",
        data: placementOverview.map((d) => d.applied),
        borderColor: "#a16207",
        backgroundColor: "transparent",
        borderDash: [5, 5],
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: placementStatus.map((d) => d.name),
    datasets: [
      {
        data: placementStatus.map((d) => d.value),
        backgroundColor: placementStatus.map((d) => d.color),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-sky-600 to-blue-600 text-white p-6 sm:p-8 shadow-lg shadow-sky-200 animate-fade-in-left hover-lift">
        <p className="text-xs uppercase tracking-[0.22em] text-sky-100 font-semibold">Placement Control Center</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold">Operational view for placements and drives</h1>
        <p className="mt-2 max-w-2xl text-sky-100">
          Track students, company participation, live drives, and placement outcomes in one view.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Students" value={dashboardStats.students.toLocaleString()} icon="🎓" color="slate" trend="+12% this month" />
        <StatCard title="Companies" value={dashboardStats.companies} icon="🏢" color="blue" trend="+3 new" />
        <StatCard title="Job Drives" value={dashboardStats.jobDrives} icon="📅" color="amber" trend="5 upcoming" />
        <StatCard title="Placements" value={dashboardStats.placements} icon="✅" color="emerald" trend="64% rate" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <ChartCard title="Placement Overview" className="xl:col-span-2">
          <div className="h-64 sm:h-72">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom" } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </ChartCard>

        <ChartCard title="Placement Status">
          <div className="h-64 sm:h-72 flex items-center justify-center">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: { legend: { position: "bottom" } },
              }}
            />
          </div>
        </ChartCard>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Recent Drives</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50">
                {["Company", "Drive Name", "Date", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentDrives.map((drive) => (
                <tr key={drive.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3.5 text-sm font-medium text-stone-800">{drive.company}</td>
                  <td className="px-4 py-3.5 text-sm text-stone-600">{drive.driveName}</td>
                  <td className="px-4 py-3.5 text-sm text-stone-600">{drive.date}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={drive.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
