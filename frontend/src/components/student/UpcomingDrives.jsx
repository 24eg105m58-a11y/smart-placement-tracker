import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import { jobDrives } from "@tempData";

const columns = [
  { key: "driveName", label: "Drive Name" },
  { key: "company", label: "Company" },
  { key: "date", label: "Date" },
  { key: "package", label: "Package" },
  { key: "status", label: "Status", type: "status" },
];

const UpcomingDrives = () => {
  const drives = jobDrives.filter((d) => d.status !== "Completed");

  return (
    <div>
      <PageHeader title="Upcoming Drives" subtitle="Browse and apply for active placement drives" />
      <DataTable columns={columns} data={drives} searchPlaceholder="Search drives..." actions={false} />
    </div>
  );
};

export default UpcomingDrives;
