import React from "react";
import { NavLink } from "react-router";

const Home = () => {
  return (
    <div className="min-h-screen text-gray-900 px-6 py-16 bg-white">
      {/* Home Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-gray-900">
          Career Canopy
        </h1>

        <h2 className="text-xl md:text-2xl font-medium text-gray-600 mb-4">
          Smart Training & Placement Tracker
        </h2>

        <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          A streamlined platform for Students, Recruiters, and Training &
          Placement Officers to manage applications, schedule drives, and track
          career analytics.
        </p>

        <div className="flex justify-center gap-4 mt-8">
          <NavLink to="/register">
            <button className="bg-blue-600 hover:bg-blue-700 text-white transition px-6 py-2.5 rounded-lg font-medium text-sm">
              Get Started
            </button>
          </NavLink>

          <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 transition px-6 py-2.5 rounded-lg font-medium text-sm">
            Explore Features
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 text-center mb-10 border-b pb-4 max-w-xs mx-auto">
          Platform Capabilities
        </h3>

        <div className="grid md:grid-cols-3 gap-10">
          {/* Student Portal */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              Student Portal
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Build & upload resumes</li>
              <li>• Apply for active placement drives</li>
              <li>• Track real-time interview progress</li>
              <li>• Receive instant updates & notifications</li>
            </ul>
          </div>

          {/* TPO Dashboard */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              TPO Dashboard
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Manage student databases</li>
              <li>• Schedule & coordinate corporate drives</li>
              <li>• Broadcast alerts & placement metrics</li>
              <li>• Generate performance reports</li>
            </ul>
          </div>

          {/* Core Analytics */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              Core Analytics
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• ATS resume structure verification</li>
              <li>• Automated student eligibility mapping</li>
              <li>• Smart job opening recommendations</li>
              <li>• Student skill gap assessment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
