import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/client";

const ApplicationDetails = () => {
  const { applicationId } = useParams();

  const [application, setApplication] = useState(null);

  useEffect(() => {
    api
      .get(`/student-api/applications/${applicationId}`)
      .then((res) => {
        setApplication(res.data.payload);
      })
      .catch(console.error);
  }, [applicationId]);

  if (!application) {
    return <div className="p-6">Loading...</div>;
  }

  const openResume = () => {
    if (application.resumeUrl) {
      window.open(application.resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
      <h1 className="text-2xl font-bold">Application Details</h1>

      <div className="mt-5 space-y-3">
        <p>
          <strong>Company:</strong> {application.companyName}
        </p>

        <p>
          <strong>Role:</strong> {application.jobRole}
        </p>

        <p>
          <strong>Status:</strong> {application.status}
        </p>

        <p>
          <strong>Applied On:</strong>{" "}
          {application.appliedOn || "-"}
        </p>
      </div>

      {(application.resumeText || application.resumeUrl) && (
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Resume Preview
              </h2>
              <p className="text-sm text-slate-500">
                View the resume directly inside the application.
              </p>
            </div>
            {application.resumeUrl && (
              <button
                type="button"
                onClick={openResume}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Open Resume
              </button>
            )}
          </div>

          <div className="max-h-[480px] overflow-y-auto rounded-2xl bg-white border border-slate-100 p-4">
            {application.resumeText ? (
              <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700 font-sans">
                {application.resumeText}
              </pre>
            ) : application.resumeUrl ? (
              <iframe
                title="Resume preview"
                src={application.resumeUrl}
                className="h-[460px] w-full rounded-xl bg-white"
              />
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-sm">
            <div className="rounded-xl bg-white border border-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                ATS Score
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {application.atsScore ?? 0}
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Skills
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {(application.extractedSkills || []).slice(0, 3).join(", ") || "-"}
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-100 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                File
              </p>
              <p className="mt-1 font-semibold text-slate-900 break-words">
                {application.resumeFileName || "Resume"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationDetails;
