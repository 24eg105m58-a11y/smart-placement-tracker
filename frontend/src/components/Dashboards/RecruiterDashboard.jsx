import React from "react";

const RecruiterDashboard = () => {
  return (
    <div>
      <h1
        className="
text-4xl
font-bold"
      >
        Recruiter Dashboard
      </h1>

      <div
        className="
grid
grid-cols-3
gap-6
mt-8"
      >
        {["Jobs", "Applicants", "Interviews"].map((x) => (
          <div
            key={x}
            className="
bg-white
rounded-3xl
shadow
p-8"
          >
            {x}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
