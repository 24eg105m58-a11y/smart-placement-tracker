import { Link } from "react-router-dom";
import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import { students } from "@tempData";

const columns = [
  { key: "rollNo", label: "Roll No." },
  { key: "name", label: "Name" },
  { key: "branch", label: "Branch" },
  { key: "batch", label: "Batch" },
  { key: "cgpa", label: "CGPA" },
  { key: "status", label: "Status", type: "status" },
];

const StudentsList = () => {
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
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
};

export default StudentsList;
