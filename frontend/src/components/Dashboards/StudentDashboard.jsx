import React, { useEffect, useState } from "react";

import axios from "axios";
const StudentDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/user-api/profile",

        {
          withCredentials: true,
        },
      );

      setUser(response.data.payload);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="space-y-6">
      <section className="grid lg:grid-cols-3 gap-6">
        <div
          className="
          lg:col-span-2
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          rounded-3xl
          text-white
          p-8"
        >
          <h1 className="text-3xl font-bold">
            Hello,
            {user?.firstname || "Student"}
            👋
          </h1>

          <p className="mt-3 text-blue-100">Welcome back to Smart Placement.</p>
        </div>

        <div className="bg-white rounded-3xl p-8">
          <h2 className="font-semibold">Profile Completion</h2>

          <div
            className="
            mt-6
            h-24
            w-24
            rounded-full
            border-[10px]
            border-blue-600
            flex
            items-center
            justify-center"
          >
            75%
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentDashboard;
