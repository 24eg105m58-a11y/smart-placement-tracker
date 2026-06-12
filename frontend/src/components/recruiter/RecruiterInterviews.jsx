import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/client";
import PageHeader from "../ui/PageHeader";
import StatusBadge from "../ui/StatusBadge";

const emptySchedule = {
  applicationId: "",
  currentRound: "",
  interviewDate: "",
  interviewTime: "10:00",
  interviewMode: "Offline",
};

const displayDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
};

const RecruiterInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptySchedule);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");

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
    () => applications.filter((app) => !["REJECTED"].includes(app.status) && app.id),
    [applications],
  );

  const selectedApplication = useMemo(
    () => scheduleOptions.find((app) => app.id === selectedApplicationId) || null,
    [scheduleOptions, selectedApplicationId],
  );

  const openSchedule = (interview) => {
    const fallbackApplicant = scheduleOptions[0] || null;
    const applicant = interview
      ? scheduleOptions.find((app) => app.id === interview.applicationId) || fallbackApplicant
      : fallbackApplicant;

    setSelectedApplicationId(applicant?.id || "");
    setForm({
      applicationId: applicant?.id || interview?.applicationId || "",
      currentRound: interview?.round || applicant?.status || "Technical Interview",
      interviewDate: interview?.date || applicant?.driveDate || "",
      interviewTime: interview?.time || "10:00",
      interviewMode: interview?.mode || "Offline",
    });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "applicationId") {
      setSelectedApplicationId(value);
      const applicant = scheduleOptions.find((app) => app.id === value);
      if (applicant) {
        setForm((prev) => ({
          ...prev,
          applicationId: value,
          currentRound:
            prev.currentRound || applicant.status || "Technical Interview",
          interviewDate: prev.interviewDate || applicant.driveDate || "",
        }));
      }
    }
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
      setSelectedApplicationId("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to schedule interview");
    } finally {
      setSaving(false);
    }
  };

  const handleDecision = async (applicationStatus) => {
    if (!form.applicationId) {
      toast.error("Please select an applicant first");
      return;
    }

    setSaving(true);
    try {
      await api.patch(`/company-api/interviews/${form.applicationId}`, {
        applicationStatus,
        currentRound:
          applicationStatus === "SELECTED"
            ? "Offer"
            : applicationStatus === "REJECTED"
              ? "Rejected"
              : form.currentRound,
      });

      toast.success(
        applicationStatus === "SELECTED"
          ? "Student marked as selected"
          : "Student marked as rejected",
      );
      setOpen(false);
      setForm(emptySchedule);
      setSelectedApplicationId("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save decision");
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
        date: app.driveDate || app.appliedOn,
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
              className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800"
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
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.candidate}</h3>
                  <p className="text-sm text-gray-500 mt-1 truncate">{item.drive}</p>
                </div>
                <StatusBadge status={item.status || "Scheduled"} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Round</p>
                  <p className="mt-1 font-medium text-gray-900">{item.round}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Mode</p>
                  <p className="mt-1 font-medium text-gray-900">{item.mode || "-"}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Date</p>
                  <p className="mt-1 font-medium text-gray-900">{displayDate(item.date)}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-400">Time</p>
                  <p className="mt-1 font-medium text-gray-900">{item.time || "-"}</p>
                </div>
              </div>

              {item.email && <p className="text-xs text-gray-400 mt-3 truncate">{item.email}</p>}

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
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 py-6 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col my-auto max-h-[92vh]">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Schedule Interview</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Pick an applicant and configure the interview details.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setForm(emptySchedule);
                  setSelectedApplicationId("");
                }}
                className="rounded-full bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
              {/* Applicant Info Banner if selected */}
              {selectedApplication && (
                <div className="rounded-2xl bg-sky-50 border border-sky-100 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-sky-600 font-bold">Applicant Details</p>
                  <p className="mt-1 text-base font-semibold text-gray-900 truncate">
                    {selectedApplication.name}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {selectedApplication.drive} · Drive Date: {displayDate(selectedApplication.driveDate)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="sm:col-span-2 block">
                  <span className="block mb-1.5 text-sm font-semibold text-gray-700">Select Applicant</span>
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

                <label className="block">
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

                <label className="block">
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

                <label className="block">
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

                <label className="block">
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
              </div>

              {/* Final Decision Section */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3 border-b border-slate-200/60 pb-3 mb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800">Final Decision</p>
                    <p className="text-xs text-slate-500">
                      Instantly select or reject the candidate.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleDecision("SELECTED")}
                    disabled={saving || !form.applicationId}
                    className="rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                  >
                    Recruit / Select
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision("REJECTED")}
                    disabled={saving || !form.applicationId}
                    className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                  >
                    Reject Candidate
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    setForm(emptySchedule);
                    setSelectedApplicationId("");
                  }}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-60"
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
