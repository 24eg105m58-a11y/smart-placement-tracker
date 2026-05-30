import { useEffect, useState } from "react";
import axios from "axios";

const AcademicProfile = () => {
  const [edit, setEdit] = useState(false);

  const [student, setStudent] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/student-api/get-academicDetails",
        {
          withCredentials: true,
        },
      );

      const { _id, __v, createdAt, updatedAt, ...academicData } =
        res.data.payload;

      setStudent(academicData);
    } catch (err) {
      console.log(err);
    }
  };
  const save = async () => {
    await axios.put(
      "http://localhost:5000/student-api/update-academicDetails",
      student,
      {
        withCredentials: true,
      },
    );

    setEdit(false);
  };

  if (!student) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 animate-pulse">
        Loading profile...
      </div>
    );
  }

  const labels = {
    rollNumber: "Roll Number",
    branch: "Branch",
    cgpa: "CGPA",
    graduationYear: "Graduation Year",
    noBacklogs: "No Active Backlogs",
    linkedIn: "LinkedIn",
    github: "GitHub",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Academic Profile</h1>
          <p className="text-gray-500 text-sm mt-1">View and update your academic details</p>
        </div>
        <button
          onClick={() => (edit ? save() : setEdit(true))}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shrink-0"
        >
          {edit ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {Object.entries(student).map(([k, v]) => (
          <div key={k}>
            <p className="mb-1.5 text-sm font-semibold text-gray-500">{labels[k] || k}</p>
            {edit ? (
              <input
                value={v}
                onChange={(e) => setStudent({ ...student, [k]: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className="bg-gray-50 px-4 py-2.5 rounded-xl text-sm text-gray-800">
                {typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AcademicProfile;
