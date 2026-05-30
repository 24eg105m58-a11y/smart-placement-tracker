import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import { jobDrives } from "@tempData";

const columns = [
  { key: "driveName", label: "Drive Name" },
  { key: "company", label: "Company" },
  { key: "date", label: "Date" },
  { key: "eligibleBranches", label: "Eligible Branches" },
  { key: "status", label: "Status", type: "status" },
];

const JobDrives = () => {
  return (
    <div>
      <PageHeader
        title="Job Drives"
        subtitle="Schedule and manage campus recruitment drives"
        action={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            + Create Drive
          </button>
        }
      />
      <DataTable columns={columns} data={jobDrives} searchPlaceholder="Search drives..." />
    </div>
  );
};

export default JobDrives;
