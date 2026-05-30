import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import { applications } from "@tempData";

const columns = [
  { key: "studentName", label: "Student Name" },
  { key: "driveName", label: "Drive Name" },
  { key: "appliedOn", label: "Applied On" },
  { key: "status", label: "Status", type: "status" },
];

const AdminApplications = () => {
  return (
    <div>
      <PageHeader title="Applications" subtitle="Track all student drive applications" />
      <DataTable columns={columns} data={applications} searchPlaceholder="Search applications..." actions={false} />
    </div>
  );
};

export default AdminApplications;
