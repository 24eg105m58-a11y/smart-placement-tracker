import { NavLink } from "react-router-dom";

const DashboardSidebar = ({ role }) => {
  const menus = {
    student: [
      ["Dashboard", "/student/student-dashboard"],
      ["Academic Profile", "/student/student-dashboard/academic-profile"],
      ["Academic Details", "/student/academic-details"],
      ["Applications", "/student/student-dashboard/applications"],
      ["Upcoming Drives", "/student/student-dashboard/drives"],
      ["Resume", "/student/student-dashboard/resume"],
      ["Notifications", "/student/student-dashboard/notifications"],
    ],

    recruiter: [
      ["Dashboard", "/recruiter/dashboard"],
      ["Company Details", "/recruiter/dashboard/company-details"],
      ["Create Jobs", "/recruiter/dashboard/jobs"],
      ["Applicants", "/recruiter/dashboard/applicants"],
    ],

    admin: [
      ["Dashboard", "/admin/dashboard"],
      ["Students", "/admin/dashboard/students"],
      ["Companies", "/admin/dashboard/companies"],
      ["Drives", "/admin/dashboard/drives"],
      ["Reports", "/admin/dashboard/reports"],
    ],
  };

  return (
    <aside className="w-72 bg-white border-r p-6">
      <h1 className="text-2xl font-bold text-blue-600">Smart Placement</h1>

      <div className="text-gray-500 mb-8 capitalize">{role}</div>

      <div className="space-y-2">
        {menus[role]?.map(([name, link]) => (
          <NavLink
            key={link}
            to={link}
            end // 👈 This fixes the persistent blue highlight on sub-routes
            className={({ isActive }) =>
              `block px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-blue-50"
              }`
            }
          >
            {name}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
