import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const StudentLayout = () => {
  const navClass = ({ isActive }) =>
    `
    flex
    items-center
    px-4
    py-3
    rounded-2xl
    text-sm
    font-medium
    transition-all
    duration-300

    ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
    }
`;

  const menu = [
    {
      name: "Dashboard",
      path: "/student/student-dashboard",
    },

    {
      name: "Academic Profile",
      path: "/student/student-dashboard/academic-profile",
    },

    {
      name: "Academic Details",
      path: "/student/student-dashboard/academic-details",
    },

    {
      name: "Resume",
      path: "/student/student-dashboard/resume",
    },

    {
      name: "Skills / Certificates",
      path: "/student/student-dashboard/skills-certificates",
    },

    {
      name: "Coding Profiles",
      path: "/student/student-dashboard/coding-profiles",
    },

    {
      name: "Upcoming Drives",
      path: "/student/student-dashboard/upcoming-drives",
    },

    {
      name: "Applications",
      path: "/student/student-dashboard/applications",
    },

    {
      name: "Interviews",
      path: "/student/student-dashboard/interviews",
    },

    {
      name: "Eligibility Tracker",
      path: "/student/student-dashboard/eligibility-tracker",
    },

    {
      name: "AI Resume Analyser",
      path: "/student/student-dashboard/resume-analyser",
    },

    {
      name: "Notifications",
      path: "/student/student-dashboard/notifications",
    },

    {
      name: "Settings",
      path: "/student/student-dashboard/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-slate-100">
      {/* SIDEBAR */}

      <aside
        className="
        w-[280px]
        shrink-0
        bg-white
        border-r
        shadow-md
        sticky
        top-0
        overflow-y-auto
        "
      >
        {/* Header */}

        <div
          className="
          p-6
          border-b
          "
        >
          <h1
            className="
            text-3xl
            font-bold
            text-blue-600
            "
          >
            Smart Placement
          </h1>

          <p
            className="
            text-gray-500
            mt-1
            "
          >
            Student Portal
          </p>
        </div>

        {/* Profile */}

        <div className="p-6">
          <div
            className="
            bg-blue-50
            rounded-2xl
            p-4
            mb-6
            "
          >
            <h3
              className="
              font-semibold
              text-gray-800
              "
            >
              Hello Student 👋
            </h3>

            <p
              className="
              text-sm
              text-gray-500
              "
            >
              Track your placements
            </p>
          </div>

          {/* MENU */}

          <div className="space-y-2">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/student/student-dashboard"}
                className={navClass}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Logout */}

        <div
          className="
          p-6
          border-t
          mt-auto
          "
        >
          <NavLink
            to="/login"
            className="
            block
            bg-red-50
            text-red-600
            px-4
            py-3
            rounded-2xl
            text-center
            hover:bg-red-100
            "
          >
            Logout
          </NavLink>
        </div>
      </aside>

      {/* MAIN */}

      <main
        className="
        flex-1
        overflow-y-auto
        p-8
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
