import React from "react";
import { NavLink } from "react-router";

const StudentDashboard = () => {
  const navClass = ({ isActive }) =>
    `block px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }`;

  return (
    <div className="flex gap-6">
      {/* SIDEBAR */}
      <aside className="w-64 shrink-0 sticky top-6 self-start bg-white border border-gray-200 rounded-3xl p-4 shadow-md">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-600">Smart Placement</h1>
          <p className="text-sm text-gray-500">Student Portal</p>
        </div>

        {/* Navigation */}
        <ul className="space-y-2">
          <li>
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/student/student-dashboard" className={navClass}>
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink to="/academic-details" className={navClass}>
              Academic Details
            </NavLink>
          </li>

          <li>
            <NavLink to="/resume" className={navClass}>
              Resume
            </NavLink>
          </li>

          <li>
            <NavLink to="/skills-certificates" className={navClass}>
              Skills / Certificates
            </NavLink>
          </li>

          <li>
            <NavLink to="/coding-profiles" className={navClass}>
              Coding Profiles
            </NavLink>
          </li>

          <li>
            <NavLink to="/upcoming-drives" className={navClass}>
              Upcoming Drives
            </NavLink>
          </li>

          <li>
            <NavLink to="/applications" className={navClass}>
              Applications
            </NavLink>
          </li>

          <li>
            <NavLink to="/interviews" className={navClass}>
              Interviews
            </NavLink>
          </li>

          <li>
            <NavLink to="/eligibility-tracker" className={navClass}>
              Eligibility Tracker
            </NavLink>
          </li>

          <li>
            <NavLink to="/resume-analyser" className={navClass}>
              AI Resume Analyser
            </NavLink>
          </li>

          <li>
            <NavLink to="/notifications" className={navClass}>
              Notifications
            </NavLink>
          </li>

          <li>
            <NavLink to="/settings" className={navClass}>
              Settings
            </NavLink>
          </li>

          {/* Logout */}
          <li className="pt-4">
            <NavLink
              to="/logout"
              className={({ isActive }) =>
                `block px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-red-600 hover:bg-red-50"
                }`
              }
            >
              Logout
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 space-y-6">
        {/* TOP SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome Banner */}
          <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold">Hello, User 👋</h1>

            <p className="mt-3 text-blue-100 max-w-xl">
              Welcome back! Track your placement journey, monitor interviews,
              and achieve your dream job.
            </p>
          </div>

          {/* Profile Completion */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 flex flex-col justify-center items-center">
            <h2 className="text-lg font-semibold text-gray-700">
              Profile Completion
            </h2>

            <div className="mt-4 w-24 h-24 rounded-full border-[10px] border-blue-500 flex items-center justify-center text-xl font-bold text-blue-600">
              75%
            </div>

            <p className="mt-3 text-sm text-gray-500 text-center">
              Complete your profile to unlock more opportunities.
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {[
            "Applied Companies",
            "Eligible Drives",
            "Interview Schedules",
            "Rounds Cleared",
            "Shortlisted",
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col items-center justify-center text-center hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-blue-600">12</h3>

              <p className="mt-2 text-sm font-medium text-gray-600">{item}</p>
            </div>
          ))}
        </section>

        {/* BOTTOM CARDS */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Drives */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 min-h-[280px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Upcoming Drives
            </h2>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-gray-50 border">
                TCS Ninja Drive
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border">
                Infosys Hiring
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border">
                Wipro Recruitment
              </div>
            </div>
          </div>

          {/* Interview Schedule */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 min-h-[280px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Interview Schedule
            </h2>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-gray-50 border">
                Technical Round - 24 May
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border">
                HR Interview - 27 May
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 min-h-[280px]">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Notifications
            </h2>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-700">
                New drive added for CSE students.
              </div>

              <div className="p-3 rounded-xl bg-green-50 text-green-700">
                Resume shortlisted successfully.
              </div>
            </div>
          </div>
        </section>

        {/* RECOMMENDED */}
        <section className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Recommended For You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border bg-gray-50 hover:shadow-md transition">
              Improve Aptitude Skills
            </div>

            <div className="p-4 rounded-2xl border bg-gray-50 hover:shadow-md transition">
              Resume Optimization Tips
            </div>

            <div className="p-4 rounded-2xl border bg-gray-50 hover:shadow-md transition">
              Top Companies Hiring This Week
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
