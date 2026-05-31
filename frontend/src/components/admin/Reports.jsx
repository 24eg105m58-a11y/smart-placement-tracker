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
import PageHeader from "../ui/PageHeader";
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

const Reports = () => {
  const [reportData, setReportData] = useState({
    reportStats: {
      placementRate: 0,
      totalOffers: 0,
      highestPackage: 0,
      averagePackage: 0,
    },
    offersOverTime: [],
    offersByBranch: [],
  });

  useEffect(() => {
    api.get("/admin-api/reports").then((res) => {
      setReportData((prev) => ({ ...prev, ...(res.data.payload || {}) }));
    }).catch(() => {});
  }, []);

  const { reportStats, offersOverTime, offersByBranch } = reportData;

  const lineData = {
    labels: offersOverTime.map((d) => d.month),
    datasets: [
      {
        label: "Offers",
        data: offersOverTime.map((d) => d.offers),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const doughnutData = {
    labels: offersByBranch.map((d) => d.name),
    datasets: [
      {
        data: offersByBranch.map((d) => d.value),
        backgroundColor: offersByBranch.map((d) => d.color),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Analytics" subtitle="Placement performance insights and trends" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Placement Rate" value={`${reportStats.placementRate}%`} icon="📊" color="blue" />
        <StatCard title="Total Offers" value={reportStats.totalOffers} icon="🎯" color="green" />
        <StatCard title="Highest Package" value={`${reportStats.highestPackage} LPA`} icon="💰" color="purple" />
        <StatCard title="Average Package" value={`${reportStats.averagePackage} LPA`} icon="📈" color="orange" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <ChartCard title="Offers Over Time" className="xl:col-span-2">
          <div className="h-64 sm:h-72">
            <Line
              data={lineData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </ChartCard>

        <ChartCard title="Offers by Branch">
          <div className="h-64 sm:h-72">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: "60%",
                plugins: { legend: { position: "bottom", labels: { boxWidth: 12, padding: 8 } } },
              }}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Reports;
