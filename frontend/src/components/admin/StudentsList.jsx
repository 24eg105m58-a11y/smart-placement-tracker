import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import api from "../../api/client";

const columns = [
  {
    key: "name",
    label: "Name",
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
          {row.profileImageUrl ? (
            <img src={row.profileImageUrl} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            (row.name || "S")
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()
          )}
        </div>
        <div>
          <div className="font-medium text-gray-800">{row.name}</div>
          <div className="text-xs text-gray-400">{row.email}</div>
        </div>
      </div>
    ),
  },
  { key: "rollNo", label: "Roll No." },
  { key: "branch", label: "Branch" },
  { key: "batch", label: "Batch" },
  { key: "cgpa", label: "CGPA" },
  { key: "status", label: "Status", type: "status" },
];

const StudentsList = () => {
  const [students, setStudents] = useState([]);

  const loadStudents = () => {
    api.get("/admin-api/students").then((res) => {
      setStudents(res.data.payload || []);
    }).catch(() => setStudents([]));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const deleteStudent = async (row) => {
    try {
      await api.put(`/user-api/soft-delete/${row.id}`);
      toast.success("Student deactivated successfully");
      loadStudents();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to deactivate student");
    }
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Manage student records and placement status"
        action={
          <Link
            to="/admin/dashboard/students/add"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Student
          </Link>
        }
      />
      <DataTable
        columns={columns}
        data={students}
        searchPlaceholder="Search students..."
        onDelete={deleteStudent}
        actions
      />
    </div>
  );
};

export default StudentsList;
