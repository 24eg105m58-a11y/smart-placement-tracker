import { useEffect, useState } from "react";
import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import api from "../../api/client";

const columns = [
  { key: "name", label: "Name" },
  { key: "drive", label: "Drive" },
  { key: "cgpa", label: "CGPA" },
  { key: "branch", label: "Branch" },
  { key: "status", label: "Status", type: "status" },
];

const Applicants = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/company-api/get-applications").then((res) => {
      setData(res.data.payload || []);
    }).catch(() => setData([]));
  }, []);

  return (
    <div>
      <PageHeader title="Applicants" subtitle="View and filter student applications" />
      <DataTable columns={columns} data={data} searchPlaceholder="Search applicants..." />
    </div>
  );
};

export default Applicants;
