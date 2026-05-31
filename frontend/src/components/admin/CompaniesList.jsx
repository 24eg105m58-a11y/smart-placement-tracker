import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import api from "../../api/client";

const columns = [
  {
    key: "name",
    label: "Company Name",
    render: (_, row) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
          {row.logo ? (
            <img src={row.logo} alt={row.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-xs font-semibold text-gray-400">
              {(row.name || "C")
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
          )}
        </div>
        <div>
          <div className="font-medium text-gray-800">{row.name}</div>
          <div className="text-xs text-gray-400">{row.industry}</div>
        </div>
      </div>
    ),
  },
  { key: "industry", label: "Industry" },
  { key: "contactPerson", label: "Contact Person" },
  { key: "email", label: "Email" },
];

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get("/admin-api/companies").then((res) => {
      setCompanies(res.data.payload || []);
    }).catch(() => setCompanies([]));
  }, []);

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Manage recruiting companies and contacts"
        action={
          <Link
            to="/recruiter/company-details"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            + Add Company
          </Link>
        }
      />
      <DataTable columns={columns} data={companies} searchPlaceholder="Search companies..." />
    </div>
  );
};

export default CompaniesList;
