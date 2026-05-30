import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import StatusBadge from "../ui/StatusBadge";
import { users } from "@tempData";

const columns = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    render: (val) => <StatusBadge status={val} />,
  },
];

const UsersManagement = () => {
  return (
    <div>
      <PageHeader
        title="Users Management"
        subtitle="Manage admin, TPO, and coordinator accounts"
        action={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            + Add User
          </button>
        }
      />
      <DataTable columns={columns} data={users} searchPlaceholder="Search users..." />
    </div>
  );
};

export default UsersManagement;
