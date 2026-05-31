import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/client";
import { branches as branchOptions } from "../constants/placementOptions";

const emptyProfile = {
  rollNumber: "",
  branch: "",
  cgpa: "",
  graduationYear: "",
  noBacklogs: true,
  linkedIn: "",
  github: "",
};

const labels = {
  rollNumber: "Roll Number",
  branch: "Branch",
  cgpa: "CGPA",
  graduationYear: "Graduation Year",
  noBacklogs: "No Active Backlogs",
  linkedIn: "LinkedIn",
  github: "GitHub",
};

const AcademicProfile = () => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(emptyProfile);
  const [hasProfile, setHasProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/student-api/get-academicDetails");
        const payload = res.data.payload;

        if (payload) {
          setStudent({
            rollNumber: payload.rollNumber || "",
            branch: payload.branch || "",
            cgpa: payload.cgpa ?? "",
            graduationYear: payload.graduationYear ?? "",
            noBacklogs: Boolean(payload.noBacklogs),
            linkedIn: payload.linkedIn || "",
            github: payload.github || "",
          });
          setHasProfile(true);
          setEdit(false);
        } else {
          setStudent(emptyProfile);
          setHasProfile(false);
          setEdit(true);
        }
      } catch (err) {
        console.log(err);
        toast.error(err?.response?.data?.message || "Unable to load academic profile");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...student,
        cgpa: student.cgpa === "" ? "" : Number(student.cgpa),
        graduationYear: student.graduationYear === "" ? "" : Number(student.graduationYear),
      };

      const res = await api.put("/student-api/update-academicDetails", payload);
      const updated = res.data.payload || {};
      setStudent({
        rollNumber: updated.rollNumber || "",
        branch: updated.branch || "",
        cgpa: updated.cgpa ?? "",
        graduationYear: updated.graduationYear ?? "",
        noBacklogs: Boolean(updated.noBacklogs),
        linkedIn: updated.linkedIn || "",
        github: updated.github || "",
      });
      setHasProfile(true);
      setEdit(false);
      toast.success("Academic details updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Unable to save academic profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 animate-pulse">
        Loading profile...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Academic Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            {hasProfile
              ? "View and update your academic details"
              : "Complete your academic details to unlock applications"}
          </p>
        </div>
        <button
          onClick={() => (edit ? save() : setEdit(true))}
          disabled={saving}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors shrink-0"
        >
          {saving ? "Saving..." : edit ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {Object.entries(student).map(([key, value]) => (
          <div key={key}>
            <p className="mb-1.5 text-sm font-semibold text-gray-500">{labels[key] || key}</p>
            {edit ? (
              key === "noBacklogs" ? (
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    name={key}
                    checked={Boolean(value)}
                    onChange={handleChange}
                    className="h-4 w-4 accent-blue-500"
                  />
                  Yes, I have no active backlogs
                </label>
              ) : (
                key === "branch" ? (
                  <select
                    value={value}
                    onChange={handleChange}
                    name={key}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Branch</option>
                    {branchOptions.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={value}
                    onChange={handleChange}
                    name={key}
                    type={key === "cgpa" || key === "graduationYear" ? "number" : "text"}
                    step={key === "cgpa" ? "0.01" : undefined}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )
              )
            ) : (
              <div className="bg-gray-50 px-4 py-2.5 rounded-xl text-sm text-gray-800">
                {typeof value === "boolean" ? (value ? "Yes" : "No") : value || "-"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicProfile;
