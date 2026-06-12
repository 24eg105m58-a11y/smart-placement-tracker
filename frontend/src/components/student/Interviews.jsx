import { useEffect, useState } from "react";

import PageHeader from "../ui/PageHeader";
import StatusBadge from "../ui/StatusBadge";
import api from "../../api/client";

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get("/student-api/interviews");

        console.log("Interview API Response:", res.data);

        setInterviews(res.data.payload || []);
      } catch (error) {
        console.error("Interview Fetch Error:", error);
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading interviews...</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Interview Schedule"
        subtitle="Track all upcoming interview rounds"
      />

      {interviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <p className="text-gray-500">No interviews scheduled yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {interviews.map((interview, index) => (
            <div
              key={interview._id || index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {interview.company || "Unknown Company"}
                  </h2>

                  <p className="text-blue-600 font-medium">
                    {interview.jobRole || "N/A"}
                  </p>
                </div>

                <StatusBadge status={interview.status || "Scheduled"} />
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <p>
                  📅 <strong>Date:</strong> {interview.date || "-"}
                </p>

                <p>
                  🕒 <strong>Time:</strong> {interview.time || "-"}
                </p>

                <p>
                  💼 <strong>Round:</strong> {interview.round || "-"}
                </p>

                <p>
                  📍 <strong>Location:</strong> {interview.location || "Online"}
                </p>

                <p>
                  💰 <strong>Package:</strong>{" "}
                  {interview.package || "Not Available"}
                </p>

                <p>
                  🏢 <strong>Mode:</strong> {interview.mode || "Online"}
                </p>
              </div>

              {interview.meetingLink && (
                <a
                  href={interview.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Join Interview →
                </a>
              )}

              <div className="mt-6">
                <button
                  onClick={() => setSelectedInterview(interview)}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Interview Details Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
            <button
              onClick={() => setSelectedInterview(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              {selectedInterview.company}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Status:</strong> {selectedInterview.status || "-"}
              </p>

              <p>
                <strong>Round:</strong> {selectedInterview.round || "-"}
              </p>

              <p>
                <strong>Date:</strong> {selectedInterview.date || "-"}
              </p>

              <p>
                <strong>Time:</strong> {selectedInterview.time || "-"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {selectedInterview.location || "Online"}
              </p>

              <p>
                <strong>Mode:</strong> {selectedInterview.mode || "Online"}
              </p>

              <p>
                <strong>Package:</strong>{" "}
                {selectedInterview.package || "Not Available"}
              </p>

              <p>
                <strong>Job Role:</strong> {selectedInterview.jobRole || "N/A"}
              </p>
            </div>

            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Interview Information</h3>

              <p className="text-gray-600">
                {selectedInterview.notes ||
                  "No additional interview information available."}
              </p>
            </div>

            {selectedInterview.meetingLink && (
              <a
                href={selectedInterview.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Join Interview
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
