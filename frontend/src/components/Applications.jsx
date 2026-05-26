import React, { useEffect, useState } from "react";

import axios from "axios";

const Applications = () => {
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplications();
  }, []);

  const getApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/student-api/get-applications",
        {
          withCredentials: true,
        },
      );

      setApplications(response.data.payload);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (applicationId) => {
    try {
      await axios.delete(
        `http://localhost:5000/student-api/withdraw-application/${applicationId}`,
        {
          withCredentials: true,
        },
      );

      setApplications(applications.filter((app) => app._id !== applicationId));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div className="text-xl">Loading...</div>;
  }

  return (
    <div>
      <h1
        className="
        text-3xl
        font-bold
        mb-8
        "
      >
        My Applications
      </h1>

      {applications.length === 0 ? (
        <div
          className="
          bg-white
          rounded-3xl
          p-12
          text-center
          shadow
          "
        >
          No Applications Yet
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((app) => (
            <div
              key={app._id}
              className="
                bg-white
                rounded-3xl
                shadow
                p-6
                flex
                justify-between
                items-center
                "
            >
              <div>
                <h2
                  className="
                    text-xl
                    font-bold
                    "
                >
                  {app.companyName}
                </h2>

                <p className="text-gray-500">{app.jobTitle}</p>

                <p
                  className="
                    text-sm
                    mt-2
                    "
                >
                  Applied: {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div
                className="
                  flex
                  gap-4
                  items-center
                  "
              >
                <span
                  className={`
                    px-4
                    py-2
                    rounded-full
                    text-sm
                    ${
                      app.status === "Selected"
                        ? "bg-green-100 text-green-700"
                        : app.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }
                    `}
                >
                  {app.status || "Pending"}
                </span>

                <button
                  onClick={() => withdraw(app._id)}
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-red-500
                    text-white
                    "
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
