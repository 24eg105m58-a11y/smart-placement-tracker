import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import { useEffect, useState } from "react";
import api from "../../api/client";

const columns = [
  { key: "driveName", label: "Drive Name" },
  { key: "company", label: "Company" },
  { key: "date", label: "Date" },
  { key: "package", label: "Package" },
  { key: "status", label: "Status", type: "status" },
];

const UpcomingDrives = () => {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    api.get("/student-api/get-jobs").then((res) => {
      setDrives(res.data.payload || []);
    }).catch(() => setDrives([]));
  }, []);

  return (
    <div>
      <PageHeader title="Upcoming Drives" subtitle="Browse and apply for active placement drives" />
      <DataTable columns={columns} data={drives} searchPlaceholder="Search drives..." actions={false} />
    </div>
  );
};

export default UpcomingDrives;
