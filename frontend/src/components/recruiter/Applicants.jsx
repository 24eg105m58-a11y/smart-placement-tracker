import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import { recruiterDashboardData } from "@tempData";

const columns = [
  { key: "name", label: "Name" },
  { key: "drive", label: "Drive" },
  { key: "cgpa", label: "CGPA" },
  { key: "branch", label: "Branch" },
  { key: "status", label: "Status", type: "status" },
];

const Applicants = () => {
  const data = recruiterDashboardData.recentApplicants.map((a, i) => ({ ...a, id: i + 1 }));

  return (
    <div>
      <PageHeader title="Applicants" subtitle="View and filter student applications" />
      <DataTable columns={columns} data={data} searchPlaceholder="Search applicants..." />
    </div>
  );
};

export default Applicants;
