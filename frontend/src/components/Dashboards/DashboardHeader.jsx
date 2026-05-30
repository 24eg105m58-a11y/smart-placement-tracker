import { useLocation, NavLink } from "react-router-dom";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/dashboard/students": "Students",
  "/admin/dashboard/students/add": "Add Student",
  "/admin/dashboard/companies": "Companies",
  "/admin/dashboard/drives": "Job Drives",
  "/admin/dashboard/applications": "Applications",
  "/admin/dashboard/placements": "Placements",
  "/admin/dashboard/reports": "Reports & Analytics",
  "/admin/dashboard/users": "Users Management",
  "/admin/dashboard/settings": "Settings",
  "/admin/dashboard/profile": "Profile",
  "/student/student-dashboard": "Dashboard",
  "/student/student-dashboard/academic-profile": "Academic Profile",
  "/student/student-dashboard/resume": "Resume Management",
  "/student/student-dashboard/applications": "Applications",
  "/student/student-dashboard/upcoming-drives": "Upcoming Drives",
  "/student/student-dashboard/interviews": "Interview Schedule",
  "/student/student-dashboard/notifications": "Notifications",
  "/student/student-dashboard/settings": "Settings",
  "/recruiter/recruiter-dashboard": "Dashboard",
  "/recruiter/recruiter-dashboard/jobs": "Create Jobs",
  "/recruiter/recruiter-dashboard/applicants": "Applicants",
  "/recruiter/recruiter-dashboard/interviews": "Interviews",
  "/recruiter/company-details": "Company Details",
};

const DashboardHeader = ({ role, onMenuClick }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  const profilePath =
    role === "admin"
      ? "/admin/dashboard/profile"
      : role === "student"
        ? "/student/student-dashboard/settings"
        : "/recruiter/company-details";

  return (
    <header className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          <p className="text-xs text-gray-400 capitalize hidden sm:block">{role} Portal</p>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      </div>

      <NavLink
        to={profilePath}
        className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 rounded-xl px-2 sm:px-3 py-2 transition-colors"
      >
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
          {role?.[0]?.toUpperCase()}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden sm:block capitalize">
          {role} User
        </span>
      </NavLink>
    </header>
  );
};

export default DashboardHeader;
