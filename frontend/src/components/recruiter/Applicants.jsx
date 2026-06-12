import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "../ui/PageHeader";
import DataTable from "../ui/DataTable";
import api from "../../api/client";

const columns = [
  {
    key: "name",
    label: "Name",
    render: (val, row) => (
      <div className="flex items-center gap-2">
        <span className="font-semibold text-slate-800">{val}</span>
        {row.recommendedByAdmin && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 shrink-0">
            ⭐ Recommended
          </span>
        )}
      </div>
    ),
  },
  { key: "drive", label: "Drive" },
  { key: "cgpa", label: "CGPA" },
  { key: "branch", label: "Branch" },
  { key: "status", label: "Status", type: "status" },
];

const Applicants = () => {
  const [data, setData] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const loadApplicants = async () => {
    try {
      const res = await api.get("/company-api/get-applications");
      const mapped = (res.data.payload || []).map((app) => ({
        ...app,
        status:
          app.status === "SELECTED"
            ? "Accepted"
            : app.status === "REJECTED"
              ? "Rejected"
              : app.status === "HOLD"
                ? "Hold"
                : app.status === "APPLIED"
                  ? "Applied"
                  : app.status,
      }));
      setData(mapped);
    } catch (error) {
      console.log(error);
      setData([]);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  const updateStatus = async (row, applicationStatus) => {
    setSavingId(row.id);
    try {
      await api.patch(`/company-api/interviews/${row.id}`, {
        applicationStatus,
        currentRound:
          applicationStatus === "SELECTED"
            ? "Offer"
            : applicationStatus === "REJECTED"
              ? "Rejected"
              : applicationStatus === "HOLD"
                ? "On Hold"
              : "Screening",
      });
      const messages = {
        SELECTED: "Applicant accepted",
        REJECTED: "Applicant rejected",
        HOLD: "Applicant put on hold",
      };
      toast.success(messages[applicationStatus] || "Applicant updated");
      await loadApplicants();
      if (selectedApplicant?.id === row.id) {
        setSelectedApplicant(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to update applicant");
    } finally {
      setSavingId(null);
    }
  };

  const acceptApplicant = (row) => updateStatus(row, "SELECTED");
  const rejectApplicant = (row) => updateStatus(row, "REJECTED");
  const holdApplicant = (row) => updateStatus(row, "HOLD");

  return (
    <div className="space-y-6">
      <PageHeader title="Applicants" subtitle="View and filter student applications" />
      <DataTable
        columns={columns}
        data={data}
        searchPlaceholder="Search applicants..."
        onEdit={acceptApplicant}
        onDelete={rejectApplicant}
        onHold={holdApplicant}
        onView={setSelectedApplicant}
        editLabel="Accept"
        deleteLabel="Reject"
        holdLabel="Hold"
        viewLabel="Details"
      />

      {selectedApplicant && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-4 sm:py-6">
          <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-100">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-sky-600 font-semibold">Applicant Details</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{selectedApplicant.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedApplicant.drive}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6">
              {[
                ["Name", selectedApplicant.name],
                ["Drive", selectedApplicant.drive],
                ["CGPA", selectedApplicant.cgpa],
                ["Branch", selectedApplicant.branch],
                ["Applied On", selectedApplicant.appliedOn],
                ["Status", selectedApplicant.status],
                ["Roll Number", selectedApplicant.rollNumber || "-"],
                ["Email", selectedApplicant.email || "-"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-900 break-words">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end border-t border-slate-100 px-4 sm:px-6 py-5 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 mr-auto transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => holdApplicant(selectedApplicant)}
                disabled={savingId === selectedApplicant.id}
                className="rounded-xl border border-amber-200 bg-white px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60 transition-colors"
              >
                Hold
              </button>
              <button
                type="button"
                onClick={() => rejectApplicant(selectedApplicant)}
                disabled={savingId === selectedApplicant.id}
                className="rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60 transition-colors"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => acceptApplicant(selectedApplicant)}
                disabled={savingId === selectedApplicant.id}
                className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applicants;
