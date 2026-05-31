import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import PageHeader from "../ui/PageHeader";
import StatusBadge from "../ui/StatusBadge";

const emptySchedule = {
  applicationId: "",
  currentRound: "",
  interviewDate: "",
  interviewTime: "",
  interviewMode: "Offline",
};

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptySchedule);

  const loadData = async () => {
    setLoading(true);
    try {
      const [interviewRes, applicationRes] = await Promise.all([
        api.get("/company-api/interviews"),
        api.get("/company-api/get-applications"),
      ]);

      setInterviews(interviewRes.data.payload || []);
      setApplications(applicationRes.data.payload || []);
    } catch (error) {
      console.log(error);
      setInterviews([]);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scheduleOptions = useMemo(
    () =>
      applications.filter(
        (app) => !["REJECTED"].includes(app.status) && app.id,
      ),
    [applications],
  );

  const openSchedule = (interview) => {
    setForm({
      applicationId: interview?.applicationId || "",
      currentRound: interview?.round || "",
      interviewDate: interview?.date || "",
      interviewTime: interview?.time || "",
      interviewMode: interview?.mode || "Offline",
    });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.applicationId) {
      toast.error("Please select an applicant");
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/company-api/interviews/${form.applicationId}`, {
        currentRound: form.currentRound,
        interviewDate: form.interviewDate,
        interviewTime: form.interviewTime,
        interviewMode: form.interviewMode,
      });

      toast.success("Interview scheduled successfully");
      setOpen(false);
      setForm(emptySchedule);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to schedule interview");
    } finally {
      setSaving(false);
    }
  };

  const displayInterviews = interviews.length
    ? interviews
    : applications.slice(0, 4).map((app) => ({
        id: app.id,
        applicationId: app.id,
        candidate: app.name,
        email: app.email,
        drive: app.drive,
        round: app.status === "APPLIED" ? "Initial Screening" : app.status,
        date: app.appliedOn,
        time: "10:00 AM",
        mode: "Offline",
        status: app.status === "APPLIED" ? "Pending" : "Scheduled",
      }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interviews"
        subtitle="Schedule and manage interview rounds"
        action={
          <button
            type="button"
            onClick={() => openSchedule(null)}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
          >
            + Schedule Interview
          </button>
        }
      />

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          Loading interviews...
        </div>
      ) : displayInterviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          No interviews scheduled yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {displayInterviews.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.candidate}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.drive}</p>
                </div>
                <StatusBadge status={item.status || "Scheduled"} />
              </div>

              <p className="text-sm font-medium text-blue-600 mt-3">{item.round}</p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>📅 {item.date || "-"}</p>
                <p>🕐 {item.time || "-"}</p>
                <p>Mode: {item.mode || "-"}</p>
                {item.email && <p className="text-gray-400">{item.email}</p>}
              </div>

              <button
                type="button"
                onClick={() => openSchedule(item)}
                className="mt-5 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition-colors"
              >
                Edit Schedule
              </button>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/40 px-4 py-8 overflow-y-auto">
          <div className="mx-auto max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="p-5 sm:p-6 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Schedule Interview</h3>
                <p className="text-sm text-gray-500">Pick an applicant and add round details</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setForm(emptySchedule);
                }}
                className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <label className="sm:col-span-2">
                <span className="block mb-1.5 text-sm font-semibold text-gray-700">Applicant</span>
                <select
                  name="applicationId"
                  value={form.applicationId}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="">Select applicant</option>
                  {scheduleOptions.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name} - {app.drive}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="block mb-1.5 text-sm font-semibold text-gray-700">Round</span>
                <input
                  name="currentRound"
                  value={form.currentRound}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Technical Interview"
                  required
                />
              </label>

              <label>
                <span className="block mb-1.5 text-sm font-semibold text-gray-700">Mode</span>
                <select
                  name="interviewMode"
                  value={form.interviewMode}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </label>

              <label>
                <span className="block mb-1.5 text-sm font-semibold text-gray-700">Date</span>
                <input
                  type="date"
                  name="interviewDate"
                  value={form.interviewDate}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </label>

              <label>
                <span className="block mb-1.5 text-sm font-semibold text-gray-700">Time</span>
                <input
                  type="time"
                  name="interviewTime"
                  value={form.interviewTime}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </label>

              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setForm(emptySchedule);
                  }}
                  className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterInterviews;
