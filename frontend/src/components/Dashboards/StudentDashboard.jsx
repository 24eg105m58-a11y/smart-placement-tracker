import React from "react";
import { NavLink } from "react-router";

const StudentDashboard = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 flex-shrink-0 p-6 h-screen sticky top-0 overflow-y-auto">
        <ul className="space-y-4">
          <NavLink
            to="/"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Home</li>
          </NavLink>
          <NavLink
            to="/student/student-dashboard"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Dashboard</li>
          </NavLink>
          <NavLink
            to="/academic-details"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Academic Details</li>
          </NavLink>
          <NavLink
            to="/resume"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>resume</li>
          </NavLink>
          <NavLink
            to="/skills-certificates"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Skills/Certifiactes</li>
          </NavLink>
          <NavLink
            to="/coding-profiles"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Coding Profiles</li>
          </NavLink>
          <NavLink
            to="/upcomming-drives"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Upcomming Drives</li>
          </NavLink>
          <NavLink
            to="/applications"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Applications</li>
          </NavLink>
          <NavLink
            to="/interviews"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Interviews</li>
          </NavLink>
          <NavLink
            to="/eligibility-tracker"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Eligibilty Tracker</li>
          </NavLink>
          <NavLink
            to="/resume-analyser"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>AI Resume Analyser</li>
          </NavLink>
          <NavLink
            to="/notifications"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>Notifications</li>
          </NavLink>
          <NavLink
            to="/settings"
            className="block px-4 py-2.5 mx-2 rounded-xl text-black font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>settings</li>
          </NavLink>
          <NavLink
            to="/logout"
            className="block px-4 py-2.5 mx-2 rounded-xl text-red-600 font-medium tracking-wide transition-all duration-200 hover:bg-white/10 hover:text-blue-200 active:scale-98"
          >
            <li>logout</li>
          </NavLink>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-6 overflow-x-hidden">
        {/* FIRST LINE: Welcome Banner & Profile Completion */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome Banner takes up 2/3 of space on desktop */}
          <div className="lg:col-span-2 p-6 bg-gray-700 text-white rounded-2xl flex flex-col justify-center">
            <h1 className="text-2xl font-bold">Hello, user-firstname</h1>
            <p className="mt-2 text-sm text-gray-200">
              Welcome back ! Track your placement journey and acheive you dream
            </p>
          </div>

          {/* Profile Completion Card takes remaining 1/3 */}
          <div className="p-6 shadow-xl bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-center">
            Profile completion
          </div>
        </div>

        {/* SECOND LINE: Stats row (Applied Companies to Shortlisted evenly distributed) */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="p-4 min-h-[90px] shadow-xl bg-white border border-gray-100 rounded-2xl text-center flex items-center justify-center text-sm font-medium">
            Applied Companies
          </div>
          <div className="p-4 min-h-[90px] shadow-xl bg-white border border-gray-100 rounded-2xl text-center flex items-center justify-center text-sm font-medium">
            Eligible Drives
          </div>
          <div className="p-4 min-h-[90px] shadow-xl bg-white border border-gray-100 rounded-2xl text-center flex items-center justify-center text-sm font-medium">
            Interview Schedules
          </div>
          <div className="p-4 min-h-[90px] shadow-xl bg-white border border-gray-100 rounded-2xl text-center flex items-center justify-center text-sm font-medium">
            Rounds Cleared
          </div>
          <div className="p-4 min-h-[90px] shadow-xl bg-white border border-gray-100 rounded-2xl text-center flex items-center justify-center text-sm font-medium">
            Shortlisted
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 shadow-xl bg-white border border-gray-100 rounded-2xl h-48">
              Upcomming Drives
            </div>
            <div className="p-8 shadow-xl bg-white border border-gray-100 rounded-2xl h-48">
              Interview Schedule
            </div>
            <div className="p-8 shadow-xl bg-white border border-gray-100 rounded-2xl h-48">
              Notifications
            </div>
          </div>

          <div className="p-2 font-semibold text-gray-700">
            recommended for you
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
