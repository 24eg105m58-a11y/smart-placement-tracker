import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import { companies } from "@tempData";

const columns = [
  { key: "name", label: "Company Name" },
  { key: "industry", label: "Industry" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "email", label: "Email" },
];

const CompaniesList = () => {
  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Manage recruiting companies and contacts"
        action={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
            + Add Company
          </button>
        }
      />
      <DataTable columns={columns} data={companies} searchPlaceholder="Search companies..." />
    </div>
  );
};

export default CompaniesList;
