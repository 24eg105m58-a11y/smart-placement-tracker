import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../../api/client";
import PageHeader from "../ui/PageHeader";
import StatusBadge from "../ui/StatusBadge";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const AIInsights = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Ask me which drive to apply for next, how to improve your profile, or whether you are eligible for a particular job.",
    },
  ]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const res = await api.get("/student-api/ai-insights");
      setData(res.data.payload || null);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Unable to load AI insights",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setMessage("");
    setSending(true);

    try {
      const res = await api.post("/student-api/ai-chat", {
        message: trimmed,
        history: nextMessages.slice(1),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            res.data.payload?.reply ||
            "I could not generate a reply right now.",
        },
      ]);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to send message");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not respond right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        subtitle="Get placement guidance, recommended drives, and a personal chat assistant"
        action={
          <Link
            to="/student/student-dashboard/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
          >
            Open Jobs
          </Link>
        }
      />

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          Loading AI insights...
        </div>
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-blue-600">
                Placement coach
              </p>
              <h2 className="mt-3 text-2xl font-black text-slate-950">
                {data?.insightSummary ||
                  "Keep your profile updated and focus on drives that match your branch and CGPA."}
              </h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  ["Branch", data?.student?.branch || "-"],
                  ["CGPA", data?.student?.cgpa ?? "-"],
                  ["Applications", data?.stats?.applicationsCount ?? 0],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl bg-slate-50 p-4 border border-slate-100"
                  >
                    <p className="text-xs uppercase tracking-wide text-slate-400">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  Eligibility {data?.stats?.eligibilityPercentage ?? 0}%
                </span>
                <span className="rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {data?.stats?.placed ? "Placed" : "In Process"}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                  Resume{" "}
                  {data?.student?.resumeUploaded ? "Uploaded" : "Pending"}
                </span>
              </div>

              <div className="mt-6 grid gap-3">
                {(data?.tips || []).map((tip) => (
                  <div
                    key={tip}
                    className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700"
                  >
                    {tip}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Top drive recommendations
              </h3>
              <div className="mt-4 space-y-3">
                {(data?.recommendations || []).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
                    No eligible drives found yet. Try updating your academic
                    details.
                  </div>
                ) : (
                  data.recommendations.map((drive) => (
                    <div
                      key={drive.id}
                      className="flex items-start justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-4"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-11 w-11 overflow-hidden rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shrink-0">
                          {drive.companyLogo ? (
                            <img
                              src={drive.companyLogo}
                              alt={drive.company}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(drive.company)
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {drive.company}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {drive.driveName}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Apply until {drive.lastDateToApply || "-"} ·{" "}
                            {drive.reason}
                          </p>
                          <Link
                            to={`/student/student-dashboard/jobs?jobId=${drive.id}`}
                            className="mt-2 inline-flex items-center text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                          >
                            View Job →
                          </Link>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <StatusBadge
                          status={drive.eligible ? "Upcoming" : "Ongoing"}
                        />
                        {drive.alreadyApplied && (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                            Applied
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Your profile snapshot
              </h3>
              <div className="mt-4 space-y-3 text-sm text-gray-700">
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span>Graduation Year</span>
                  <span className="font-medium">
                    {data?.student?.graduationYear || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span>No Backlogs</span>
                  <span className="font-medium">
                    {data?.student?.noBacklogs ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span>LinkedIn</span>
                  <span className="font-medium truncate max-w-[220px]">
                    {data?.student?.linkedIn || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <span>GitHub</span>
                  <span className="font-medium truncate max-w-[220px]">
                    {data?.student?.github || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-5 py-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Chatbot
                </h3>
                <p className="text-sm text-gray-500">
                  Ask about drives, eligibility, resumes, or next steps
                </p>
              </div>

              <div className="h-[420px] overflow-y-auto p-5 space-y-3 bg-slate-50">
                {messages.map((msg, index) => (
                  <div
                    key={`${msg.role}-${index}`}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      msg.role === "assistant"
                        ? "bg-white border border-gray-100 text-gray-700"
                        : "ml-auto bg-blue-600 text-white shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <form
                onSubmit={sendMessage}
                className="p-4 border-t border-gray-100 bg-white"
              >
                <div className="flex gap-3">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question about your next best drive..."
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIInsights;
