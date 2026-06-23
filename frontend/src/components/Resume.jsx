import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";
import PageHeader from "./ui/PageHeader";

const Resume = () => {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadResume = async () => {
    setLoading(true);
    try {
      const res = await api.get("/student-api/resume");
      setResume(res.data.payload || null);
    } catch (error) {
      console.log(error);
      setResume(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a resume file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setSaving(true);
    try {
      const res = await api.post("/student-api/resume", formData);
      setResume(res.data.payload || null);
      setFile(null);
      toast.success(res.data.message || "Resume uploaded successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to upload resume");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!resume?.id) {
      return;
    }

    try {
      await api.delete(`/student-api/resume/${resume.id}`);
      toast.success("Resume removed successfully");
      setResume(null);
      setFile(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to remove resume");
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Resume Management" subtitle="Upload, view, and manage your resume" />

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
          Loading resume...
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
            {resume ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-xl">
                    📄
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{resume.fileName || "Resume"}</p>
                    <p className="text-sm text-gray-500">Uploaded on {resume.uploadedOn}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      ATS Score: {resume.atsScore ?? 0}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => window.open(resume.resumeUrl, "_blank", "noopener,noreferrer")}
                    className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-4 py-2 text-sm rounded-xl text-red-600 border border-red-200 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No resume uploaded yet. Upload one below to get started.
              </div>
            )}
          </div>

          <form
            onSubmit={handleUpload}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8"
          >
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload New Resume
            </label>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full border border-gray-200 rounded-xl p-3 text-sm file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-lg"
            />
            {file && <p className="mt-3 text-sm text-gray-500">{file.name}</p>}
            <button
              type="submit"
              disabled={saving}
              className="mt-5 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm disabled:opacity-60"
            >
              {saving ? "Uploading..." : "Upload Resume"}
            </button>

            {resume?.resumeText && (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-600 font-semibold">
                      Resume Preview
                    </p>
                    <p className="text-sm text-slate-500">
                      Parsed text from your uploaded resume.
                    </p>
                  </div>
                  {resume.resumeUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        window.open(resume.resumeUrl, "_blank", "noopener,noreferrer")
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Open
                    </button>
                  )}
                </div>
                <pre className="max-h-[360px] overflow-y-auto whitespace-pre-wrap break-words rounded-xl bg-white p-4 text-sm leading-6 text-slate-700 border border-slate-100">
                  {resume.resumeText}
                </pre>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default Resume;
