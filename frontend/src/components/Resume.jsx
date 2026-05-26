import React from "react";

const Applications = () => {
  const jobs = ["Google", "Microsoft", "Amazon"];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Applications</h1>

      <div className="grid gap-5">
        {jobs.map((job) => (
          <div
            key={job}
            className="
            bg-white
            rounded-3xl
            p-6
            shadow
            "
          >
            <h2 className="font-semibold">{job}</h2>

            <p className="text-gray-500">Status: Applied</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applications;
