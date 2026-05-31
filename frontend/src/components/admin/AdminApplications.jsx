import { useEffect, useState } from "react";
import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import api from "../../api/client";

const columns = [
  { key: "studentName", label: "Student Name" },
  { key: "driveName", label: "Drive Name" },
  { key: "appliedOn", label: "Applied On" },
  { key: "status", label: "Status", type: "status" },
];

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/admin-api/applications").then((res) => {
      setApplications(res.data.payload || []);
    }).catch(() => setApplications([]));
  }, []);

  return (
    <div>
      <PageHeader title="Applications" subtitle="Track all student drive applications" />
      <DataTable columns={columns} data={applications} searchPlaceholder="Search applications..." actions={false} />
    </div>
  );
};

export default AdminApplications;
