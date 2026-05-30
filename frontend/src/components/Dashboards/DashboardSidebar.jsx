import { NavLink } from "react-router-dom";

const menuConfig = {
  admin: {
    title: "Admin Portal",
    items: [
      { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
      { name: "Students", path: "/admin/dashboard/students", icon: "🎓" },
      { name: "Companies", path: "/admin/dashboard/companies", icon: "🏢" },
      { name: "Job Drives", path: "/admin/dashboard/drives", icon: "📅" },
      { name: "Applications", path: "/admin/dashboard/applications", icon: "📋" },
      { name: "Placements", path: "/admin/dashboard/placements", icon: "✅" },
      { name: "Reports", path: "/admin/dashboard/reports", icon: "📈" },
      { name: "Users", path: "/admin/dashboard/users", icon: "👥" },
      { name: "Settings", path: "/admin/dashboard/settings", icon: "⚙️" },
    ],
  },
  student: {
    title: "Student Portal",
    items: [
      { name: "Dashboard", path: "/student/student-dashboard", icon: "📊" },
      { name: "Academic Profile", path: "/student/student-dashboard/academic-profile", icon: "📚" },
      { name: "Resume", path: "/student/student-dashboard/resume", icon: "📄" },
      { name: "Applications", path: "/student/student-dashboard/applications", icon: "📋" },
      { name: "Upcoming Drives", path: "/student/student-dashboard/upcoming-drives", icon: "📅" },
      { name: "Interviews", path: "/student/student-dashboard/interviews", icon: "🎯" },
      { name: "Notifications", path: "/student/student-dashboard/notifications", icon: "🔔" },
      { name: "Settings", path: "/student/student-dashboard/settings", icon: "⚙️" },
    ],
  },
  recruiter: {
    title: "Recruiter Portal",
    items: [
      { name: "Dashboard", path: "/recruiter/recruiter-dashboard", icon: "📊" },
      { name: "Company Details", path: "/recruiter/company-details", icon: "🏢" },
      { name: "Create Jobs", path: "/recruiter/recruiter-dashboard/jobs", icon: "💼" },
      { name: "Applicants", path: "/recruiter/recruiter-dashboard/applicants", icon: "👥" },
      { name: "Interviews", path: "/recruiter/recruiter-dashboard/interviews", icon: "🎯" },
    ],
  },
};

const DashboardSidebar = ({ role, portalTitle, open, onClose }) => {
  const config = menuConfig[role] || menuConfig.admin;
  const title = portalTitle || config.title;

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-white border-r border-gray-100 shadow-lg lg:shadow-none
        flex flex-col shrink-0
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-blue-600">Smart Placement</h1>
            <p className="text-xs text-gray-500 mt-0.5">{title}</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            ✕
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {config.items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path.endsWith("dashboard") || item.path.endsWith("recruiter-dashboard")}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <NavLink
          to="/logout"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors"
        >
          Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
