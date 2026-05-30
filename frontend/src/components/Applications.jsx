import { useEffect, useState } from "react";
import axios from "axios";
import PageHeader from "./ui/PageHeader";
import DataTable from "./ui/DataTable";
import { applications as tempApplications } from "@tempData";

const columns = [
  { key: "driveName", label: "Drive Name" },
  { key: "appliedOn", label: "Applied On" },
  { key: "status", label: "Status", type: "status" },
];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/student-api/get-applications",
        { withCredentials: true },
      );
      const data = response.data.payload || [];
      if (data.length > 0) {
        setApplications(
          data.map((app, i) => ({
            id: app._id || i,
            driveName: app.jobTitle || app.companyName,
            appliedOn: new Date(app.createdAt).toLocaleDateString(),
            status: app.status || "Applied",
          })),
        );
      } else {
        setUseFallback(true);
        setApplications(
          tempApplications.slice(0, 5).map((a) => ({
            id: a.id,
            driveName: a.driveName,
            appliedOn: a.appliedOn,
            status: a.status,
          })),
        );
      }
    } catch {
      setUseFallback(true);
      setApplications(
        tempApplications.slice(0, 5).map((a) => ({
          id: a.id,
          driveName: a.driveName,
          appliedOn: a.appliedOn,
          status: a.status,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (row) => {
    if (useFallback) return;
    try {
      await axios.delete(
        `http://localhost:5000/student-api/withdraw-application/${row.id}`,
        { withCredentials: true },
      );
      setApplications((prev) => prev.filter((a) => a.id !== row.id));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-gray-400 animate-pulse">Loading applications...</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My Applications" subtitle="Track and manage your drive applications" />
      <DataTable
        columns={columns}
        data={applications}
        searchPlaceholder="Search applications..."
        onDelete={useFallback ? undefined : withdraw}
        actions={!useFallback}
      />
    </div>
  );
};

export default Applications;
