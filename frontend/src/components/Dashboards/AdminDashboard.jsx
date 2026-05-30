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
import {
  dashboardStats,
  placementOverview,
  placementStatus,
  recentDrives,
} from "@tempData";

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
  const lineData = {
    labels: placementOverview.map((d) => d.month),
    datasets: [
      {
        label: "Placed",
        data: placementOverview.map((d) => d.placed),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Applied",
        data: placementOverview.map((d) => d.applied),
        borderColor: "#94a3b8",
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Students" value={dashboardStats.students.toLocaleString()} icon="🎓" color="blue" trend="+12% this month" />
        <StatCard title="Companies" value={dashboardStats.companies} icon="🏢" color="purple" trend="+3 new" />
        <StatCard title="Job Drives" value={dashboardStats.jobDrives} icon="📅" color="orange" trend="5 upcoming" />
        <StatCard title="Placements" value={dashboardStats.placements} icon="✅" color="green" trend="64% rate" />
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
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentDrives.map((drive) => (
                <tr key={drive.id} className="hover:bg-gray-50/80">
                  <td className="px-4 py-3.5 text-sm font-medium text-gray-800">{drive.company}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{drive.driveName}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{drive.date}</td>
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
