import React from "react";

const RecruiterDashboard = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Recruiter Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
        {["Jobs", "Applicants", "Interviews"].map((x) => (
          <div
            key={x}
            className="bg-white rounded-2xl sm:rounded-3xl shadow p-6 sm:p-8"
          >
            {x}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
