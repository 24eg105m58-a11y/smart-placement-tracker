import { useEffect, useState } from "react";
import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import api from "../../api/client";

const columns = [
  { key: "studentName", label: "Student Name" },
  { key: "company", label: "Company" },
  { key: "package", label: "Package (LPA)", render: (val) => `${val} LPA` },
  { key: "placedOn", label: "Placed On" },
];

const Placements = () => {
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    api.get("/admin-api/placements").then((res) => {
      setPlacements(res.data.payload || []);
    }).catch(() => setPlacements([]));
  }, []);

  return (
    <div>
      <PageHeader title="Placements" subtitle="View confirmed student placements and packages" />
      <DataTable columns={columns} data={placements} searchPlaceholder="Search placements..." actions={false} />
    </div>
  );
};

export default Placements;
