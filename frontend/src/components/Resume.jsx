import { useState } from "react";
import toast from "react-hot-toast";
import PageHeader from "./ui/PageHeader";

const Resume = () => {
  const [file, setFile] = useState(null);
  const [uploaded] = useState({ name: "Rahul_Sharma_Resume.pdf", uploadedOn: "2026-05-10" });

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }
    toast.success("Resume uploaded successfully!");
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="Resume Management" subtitle="Upload, view, and manage your resume" />

      {uploaded && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-xl">📄</div>
            <div>
              <p className="font-semibold text-gray-900">{uploaded.name}</p>
              <p className="text-sm text-gray-500">Uploaded on {uploaded.uploadedOn}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-50">View</button>
            <button className="px-4 py-2 text-sm rounded-xl text-red-600 border border-red-200 hover:bg-red-50">Remove</button>
          </div>
        </div>
      )}

      <form onSubmit={handleUpload} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Upload New Resume</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border border-gray-200 rounded-xl p-3 text-sm file:mr-4 file:px-4 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-lg"
        />
        <button
          type="submit"
          className="mt-5 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-medium text-sm"
        >
          Upload Resume
        </button>
      </form>
    </div>
  );
};

export default Resume;
