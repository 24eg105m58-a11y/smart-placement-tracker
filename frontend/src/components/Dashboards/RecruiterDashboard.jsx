import StatCard from "../ui/StatCard";
import DataTable from "../ui/DataTable";
import ChartCard from "../ui/ChartCard";
import { recruiterDashboardData } from "@tempData";

const applicantColumns = [
  { key: "name", label: "Name" },
  { key: "drive", label: "Drive" },
  { key: "cgpa", label: "CGPA" },
  { key: "branch", label: "Branch" },
  { key: "status", label: "Status", type: "status" },
];

const RecruiterDashboard = () => {
  const { activeJobs, totalApplicants, scheduledInterviews, recentApplicants } = recruiterDashboardData;

  return (
    <div className="space-y-6">
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
