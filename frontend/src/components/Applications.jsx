import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import PageHeader from "./ui/PageHeader";
import DataTable from "./ui/DataTable";

const columns = [
  { key: "driveName", label: "Drive Name" },
  { key: "appliedOn", label: "Applied On" },
  { key: "status", label: "Status", type: "status" },
];

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    try {
      const response = await api.get("/student-api/get-applications");
      setApplications(response.data.payload || []);
    } catch (error) {
      console.log(error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (row) => {
    try {
      await api.delete(`/student-api/withdraw-application/${row.id}`);
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
        onDelete={withdraw}
        onView={(row) =>
          navigate(`/student/student-dashboard/application/${row.id}`)
        }
        viewLabel="Open"
        actions
      />
    </div>
  );
};

export default Applications;
